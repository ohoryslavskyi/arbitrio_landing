# Деплой

Сторінка живе за адресою **https://arbitrio.net/presentation/** на коробці Hetzner
(`49.12.102.39`), поруч із адмінкою та вхідними дверима проєкту ArbBot.

## Як це влаштовано

```
GitHub Actions (.github/workflows/deploy.yml)
  build   npm ci → npm run build → перевірка base → caddy validate
  deploy  rsync у /srv/arbitrio-landing/releases/<sha>/
          rsync deploy/Caddyfile → /srv/arbitrio-landing/Caddyfile
          .github/deploy/activate.sh по ssh

коробка
  /srv/arbitrio-landing/
    Caddyfile            ← конфіг віддачі, теж із цього репозиторію
    releases/<sha>/      ← збірки, останні 5
    current -> releases/<sha>   ← симлінк, який перемикає пайплайн

  контейнер `landing` (стек admin-saas)
    caddy:2-alpine, монтує /srv/arbitrio-landing як /srv:ro
    root * /srv/current
```

**Чому окремий контейнер, а не файли всередині вхідних дверей.** Двері — це форма
входу з найвужчим CSP і без жодного скрипта; тут навпаки — бандл на 90 КБ. В одному
процесі політику довелося б послабити саме на тій сторінці, куди вводять пароль.

**Кеш.** `assets/*` мають хеш у назві й віддаються `immutable` на рік; `index.html` —
`no-cache`, бо саме він називає імена нових бандлів. Закешований індекс після деплою
просив би файли, яких уже немає.

Ключове рішення: **контейнер не перезбирається**. Деплой — це покласти каталог на диск
і перемкнути симлінк. Caddy розв'язує `current` на кожен запит, тож нова збірка стає
живою в мить `rename(2)`, без даунтайму й без `docker build` на проді.

Контейнер перезапускається рівно в одному випадку — коли змінився `deploy/Caddyfile`.
Пайплайн визначає це сам, звіряючи mtime файла зі `StartedAt` контейнера.

## Відкат

```bash
ssh root@49.12.102.39
ls -1t /srv/arbitrio-landing/releases      # останні 5 збірок
cd /srv/arbitrio-landing
ln -sfn releases/<потрібний-sha> .current.new && mv -Tf .current.new current
```

Діє одразу, рестарт не потрібен. Пайплайн робить такий відкат і сам, якщо після
перемикання публічний URL не віддає сторінку або її бандл.

## Секрети репозиторію

`Settings → Secrets and variables → Actions`:

| Секрет | Значення |
| --- | --- |
| `DEPLOY_HOST` | `49.12.102.39` — саме IP, не ім'я: ключ хоста пришпилений під нього |
| `DEPLOY_USER` | `root` |
| `DEPLOY_SSH_KEY` | приватний ключ (повністю, разом із рядками `-----BEGIN/END-----`) |
| `DEPLOY_SSH_PORT` | не задавати, якщо 22 |

Окремий ключ саме для деплою, а не твій особистий:

```bash
ssh-keygen -t ed25519 -N '' -C 'github-actions:arbitrio_landing' -f ~/.ssh/arbitrio_landing_deploy
ssh-copy-id -i ~/.ssh/arbitrio_landing_deploy.pub root@49.12.102.39
pbcopy < ~/.ssh/arbitrio_landing_deploy       # → у секрет DEPLOY_SSH_KEY
rm ~/.ssh/arbitrio_landing_deploy             # локальна копія більше не потрібна
```

Ключ ХОСТА пришпилений просто у `deploy.yml` (захешований, адреса з нього не читається).
Якщо коробку перевстановлять, деплой впаде на `HOST KEY VERIFICATION FAILED` — це не баг.
Оновити рядок виводом `ssh-keyscan -H -t ed25519 49.12.102.39`.

## Порядок першого викочування

1. Завести секрети (вище). Без них деплой впаде на кроці `Set up SSH`.
2. Змержити цю гілку в `main`. Пайплайн покладе збірку в
   `/srv/arbitrio-landing/releases/<sha>` і `Caddyfile` поруч. Сторінку в цей момент
   **ще віддає старий образ** із монорепи — нове просто лежить на диску й чекає.
3. Змержити гілку `ci/landing-to-srv` у монорепі ArbBot (готова, деталі нижче).
   `docker compose up -d` перестворить контейнер уже з монтуванням
   `/srv/arbitrio-landing` — і сторінка стане новою.

🔴 Саме в цьому порядку. Навпаки не вийде: пре-фліт монорепи впаде з названою
причиною, бо `/srv/arbitrio-landing/Caddyfile` ще не існує.

⚠️ Димова перевірка на кроці 2 пройде, але доведе мало: вона стукає в публічний URL, а
той ще віддає стару збірку (яка теж лежить під `/presentation/assets`). Перший
по-справжньому наскрізний прогін — це наступний деплой після кроку 3.

Каталог `/srv/arbitrio-landing/releases` на коробці вже створено.

## Що змінилось у монорепі ArbBot

Міграція зроблена, лежить у гілці **`ci/landing-to-srv`**
(github.com/valerarv4/ArbBot) і чекає на мерж — див. «Порядок першого викочування».

| Файл | Що з ним |
| --- | --- |
| `admin-saas/docker-compose.prod.yml` | сервіс `landing`: `build: ../landing` → `image: caddy:2-alpine` з монтуванням `/srv/arbitrio-landing:/srv:ro`; healthcheck переїхав із `landing/Dockerfile` сюди |
| `.github/workflows/deploy-admin-saas.yml` | прибрано job `landing`, `landing/**` із path-фільтрів і зі `$COMPOSE build`; додано пре-фліт на наявність `/srv/arbitrio-landing/Caddyfile` |
| `admin-saas/Caddyfile` | маршрут `handle_path /presentation/*` **без змін** — виправлені лише коментарі |
| `landing/` | видалено: вихідники, `Dockerfile` і `Caddyfile` живуть тут |
| `CLAUDE.md`, `admin-saas/DEPLOY.md`, `entry/README.md` | посилання на `landing/` → на цей репозиторій |

Пре-фліт вартий окремої згадки: він валить деплой монорепи з названою причиною, якщо
`/srv/arbitrio-landing/Caddyfile` ще немає. Без нього переплутаний порядок мержів дав
би `up -d` на порожньому каталозі — Caddy без конфігу, `restart: unless-stopped` у
циклі падінь, і причина видима лише в логах контейнера, тоді як сам деплой світився б
зеленим аж до перевірки healthcheck.

🔴 Що лишилось обовʼязком монорепи назавжди: маршрут `/presentation/*` у
`admin-saas/Caddyfile`. Приберуть його — сторінка зникне, і дізнаємось ми про це
звідси, з димової перевірки.
