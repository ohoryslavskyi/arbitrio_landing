#!/usr/bin/env bash
#
# Активація вже завантаженого релізу на коробці. Скрипт їде на сервер по stdin
# (`ssh … bash -s < activate.sh`), а не лежить там копією: інакше він жив би у двох
# місцях і розходився б із пайплайном мовчки.
#
# Очікує в оточенні: ROOT, SHA, PUBLIC_URL.
#
# Робить рівно чотири речі:
#   1. перевіряє, що приїхало саме те, що очікували;
#   2. атомарно перемикає симлінк `current`;
#   3. перезапускає контейнер, ЯКЩО змінився Caddyfile (і тільки тоді);
#   4. б'є по публічному URL і, якщо сторінка мертва, повертає симлінк назад.
set -euo pipefail

: "${ROOT:?ROOT не заданий}"
: "${SHA:?SHA не заданий}"
: "${PUBLIC_URL:?PUBLIC_URL не заданий}"

REL="$ROOT/releases/$SHA"
KEEP=5

# ── 1. Що саме приїхало ───────────────────────────────────────────────────────
#
# Перевірка тут, а не лише в CI, бо між гейтом і диском стоїть мережа: обірваний
# rsync лишає каталог, у якому файли є, але не всі.
[ -f "$REL/index.html" ] || { echo "❌ немає $REL/index.html — реліз не доїхав"; exit 1; }
grep -q 'src="/presentation/assets/' "$REL/index.html" \
  || { echo "❌ $REL/index.html не посилається на /presentation/assets"; exit 1; }
[ -f "$ROOT/Caddyfile" ] || { echo "❌ немає $ROOT/Caddyfile"; exit 1; }

# ── 2. Перемик симлінка ───────────────────────────────────────────────────────
#
# `ln -sfn` НЕ атомарний: він знімає старий симлінк і створює новий, тобто між двома
# сисколами `current` не існує взагалі, і запит у цю щілину дістає 404. `mv -T` на
# тому самому пристрої — це rename(2), тобто одна неподільна операція.
#
# 🔴 Ціль ВІДНОСНА (`releases/$SHA`). Усередині контейнера каталог змонтований як
# `/srv`, і абсолютний шлях із хоста там не існує — Caddy віддавав би 404 на все.
PREV="$(readlink "$ROOT/current" 2>/dev/null || true)"

ln -sfn "releases/$SHA" "$ROOT/.current.new"
mv -Tf "$ROOT/.current.new" "$ROOT/current"
echo "✅ current → releases/$SHA (було: ${PREV:-нічого})"

# ── 3. Контейнер ──────────────────────────────────────────────────────────────
#
# Сервіс `landing` описаний у стеку `admin-saas`, тож шукаємо його за мітками
# compose, а не за іменем контейнера: ім'я залежить від назви проєкту й номера
# репліки, а мітки — ні.
cid="$(docker ps -q \
  --filter 'label=com.docker.compose.service=landing' \
  --filter 'status=running' | head -n1)"
[ -n "$cid" ] || { echo "❌ контейнер landing не знайдено — стек admin-saas піднятий?"; exit 1; }

# ⚠️ Вміст bind-mount'а контейнер бачить одразу: Caddy розв'язує `current` на кожен
# запит, тож ЗБІРКА доїжджає без рестарту. А от власний конфіг Caddy читає один раз
# при старті, і `caddy reload` тут неможливий у принципі — у `deploy/Caddyfile`
# стоїть `admin off`, тобто адмін-API, через який reload і працює, вимкнений.
#
# Ознака змін — ВМІСТ файла, а не його mtime.
#
# 🔴 Спокуслива перевірка «mtime файла проти StartedAt контейнера» тут НЕ працює, і
# ламається вона тихо. `rsync -a` переносить mtime ДЖЕРЕЛА навіть коли вміст
# ідентичний (перевірено на GNU rsync 3.4.1: файл із mtime 2020 року, перезалитий із
# джерела з mtime 2030-го, дістає 2030-й без жодної передачі даних). А джерело тут —
# чекаут на раннері GitHub, якому `actions/checkout` щоразу ставить поточний час.
#
# Тобто mtime був би свіжішим за StartedAt НА КОЖНОМУ деплої, і контейнер
# перезапускався б щоразу — рівно те, заради усунення чого й зроблено перемик
# симлінка. Секунда простою на кожному викочуванні, і ніхто б не зрозумів чому.
#
# Хеш цієї пастки не має: він міняється тоді й лише тоді, коли змінився конфіг.
#
# Самолікувальність збережена, і це важливо: штамп пишеться ТІЛЬКИ після успішного
# рестарту. Якщо рестарт упав, був пропущений або контейнер не піднявся — штамп
# лишається старим, і наступний деплой спробує знову. Правку руками на коробці хеш
# ловить так само, як ловив mtime.
cfg_hash="$(sha256sum "$ROOT/Caddyfile" | cut -d' ' -f1)"
stamp="$ROOT/.caddyfile.applied"

if [ "$(cat "$stamp" 2>/dev/null || true)" = "$cfg_hash" ]; then
  echo "✅ конфіг не змінювався з останнього застосування — рестарт не потрібен"
else
  # ⚠️ ВАЛІДАЦІЯ ДО РЕСТАРТУ. Зламаний конфіг означає, що контейнер не підніметься,
  # `restart: unless-stopped` заганяє його в цикл, і сторінка лягає цілком. CI вже
  # перевіряв цей файл, але перевіряв ЩЕ ДО мережі — тут ми дивимось на те, що
  # справді лежить на диску, тим самим образом і за тим самим шляхом.
  if ! docker run --rm -v "$ROOT:/srv:ro" caddy:2-alpine \
         caddy validate --config /srv/Caddyfile --adapter caddyfile; then
    echo "❌ Caddyfile на коробці не валідний — рестарт скасовано."
    echo "   Стара конфігурація лишається робочою; сторінка не падає."
    exit 1
  fi

  echo "Caddyfile змінився — перезапускаю контейнер"
  docker restart "$cid" >/dev/null

  # Не «піднявся», а «ЛИШИВСЯ піднятим»: у циклі падінь `Running` між спробами теж
  # буває true, тож сама по собі вона не доводить нічого.
  for _ in $(seq 1 20); do
    status="$(docker inspect --format '{{.State.Health.Status}}' "$cid" 2>/dev/null || echo unknown)"
    [ "$status" = "healthy" ] && break
    sleep 3
  done
  if [ "${status:-unknown}" != "healthy" ]; then
    echo "❌ landing не піднявся (стан: ${status:-unknown}) — останні 40 рядків:"
    docker logs --tail 40 "$cid" 2>&1 || true
    exit 1
  fi
  # ⚠️ Аж ТУТ, після підтвердженого healthy. Записати штамп раніше означало б
  # «застосовано» для конфігу, який контейнер, можливо, так і не прочитав.
  printf '%s\n' "$cfg_hash" > "$stamp"
  echo "✅ landing healthy, конфіг застосовано"
fi

# ── 4. Димова перевірка по ПУБЛІЧНОМУ URL ─────────────────────────────────────
#
# Саме по публічному, а не по контейнеру: між ними стоїть маршрут `/presentation/*`
# у Caddy монорепи, і найдорожча поламка цієї сторінки — саме роз'їзд цього маршруту
# з `base` у збірці. Зсередини контейнера він не видимий узагалі.
rollback() {
  if [ -n "$PREV" ]; then
    ln -sfn "$PREV" "$ROOT/.current.new"
    mv -Tf "$ROOT/.current.new" "$ROOT/current"
    echo "↩️  відкат: current → $PREV"
  else
    echo "⚠️  відкатити нема на що — це перший реліз"
  fi
}

html="$(mktemp)"
trap 'rm -f "$html"' EXIT

if ! curl -fsS --max-time 15 -o "$html" "$PUBLIC_URL"; then
  echo "❌ $PUBLIC_URL не відповів"
  rollback
  exit 1
fi

# Індекс називає імена бандлів — саме їх і перевіряємо. Сторінка, яка віддала HTML,
# але не віддає свій JS, для відвідувача так само порожня.
asset="$(grep -o 'src="/presentation/assets/[^"]*"' "$html" | head -n1 | cut -d'"' -f2)"
if [ -z "$asset" ]; then
  echo "❌ у відповіді немає посилання на /presentation/assets — маршрут Caddy і base збірки розійшлись"
  head -c 400 "$html"; echo
  rollback
  exit 1
fi

origin="${PUBLIC_URL%/presentation/}"
if ! curl -fsS --max-time 15 -o /dev/null "$origin$asset"; then
  echo "❌ бандл $asset не віддається"
  rollback
  exit 1
fi
echo "✅ $PUBLIC_URL живий, бандл $asset віддається"

# ── Прибирання старих релізів ─────────────────────────────────────────────────
#
# Диск спільний із ботом, адмінкою і Postgres. Тримаємо останні $KEEP — цього
# вистачає на відкат, і воно не росте мовчки.
cd "$ROOT/releases"
current_target="$(basename "$(readlink "$ROOT/current")")"
ls -1dt */ 2>/dev/null | sed 's:/$::' | tail -n +$((KEEP + 1)) | while read -r old; do
  [ "$old" = "$current_target" ] && continue
  rm -rf -- "$old"
  echo "🧹 прибрано реліз $old"
done

echo "🚀 деплой завершено: $SHA"
