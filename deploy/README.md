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
3. Зробити міграцію монорепи (нижче) і змержити її. `docker compose up -d` перестворить
   контейнер уже з монтуванням `/srv/arbitrio-landing` — і сторінка стане новою.

⚠️ Димова перевірка на кроці 2 пройде, але доведе мало: вона стукає в публічний URL, а
той ще віддає стару збірку (яка теж лежить під `/presentation/assets`). Перший
по-справжньому наскрізний прогін — це наступний деплой після кроку 3.

Каталог `/srv/arbitrio-landing/releases` на коробці вже створено.

## Одноразова міграція монорепи ArbBot

Доти, доки її не зроблено, пайплайн кладе файли на диск, але сторінку віддає стара
збірка з образу. Монорепо (`github.com/valerarv4/ArbBot`) віддає цьому репозиторію
вміст сторінки й лишає собі тільки опис контейнера.

🔴 **Порядок важливий.** Спершу має пройти хоча б один зелений деплой ЦЬОГО репозиторію
— інакше compose підніме контейнер на порожньому `/srv/arbitrio-landing`, не знайде
`Caddyfile` і піде в цикл падінь через `restart: unless-stopped`.

### 1. `admin-saas/docker-compose.prod.yml`

Було:

```yaml
  landing:
    build: ../landing
    # Порт назовні не публікується: єдиний вхід — Caddy у тій самій мережі compose.
    logging:
      driver: json-file
      options: { max-size: '10m', max-file: '3' }
    restart: unless-stopped
```

Стало:

```yaml
  landing:
    # Образ, а не збірка: вміст сторінки й конфіг її віддачі належать репозиторію
    # `arbitrio_landing` і приїжджають на диск його власним пайплайном. Тут лишився
    # опис контейнера, який не мусить мінятись, коли міняється сторінка.
    image: caddy:2-alpine
    # ⚠️ `caddy` тут ДВІЧІ, і це не одрук: образ не має ENTRYPOINT, тож без другого
    # слова контейнер намагався б запустити `run` як програму.
    command: caddy run --config /srv/Caddyfile --adapter caddyfile
    volumes:
      # `current` усередині — ВІДНОСНИЙ симлінк на `releases/<sha>`, тому каталог
      # монтується цілком, а не по одному релізу: перемик на хості діє одразу.
      - /srv/arbitrio-landing:/srv:ro
    # Раніше healthcheck приходив із Dockerfile лендінгу; тепер образ чужий, тож
    # перевірка переїхала сюди. Деплой обох репозиторіїв на неї спирається.
    healthcheck:
      test: ['CMD', 'wget', '-q', '-O', '/dev/null', 'http://127.0.0.1:8080/healthz']
      interval: 30s
      timeout: 5s
      start_period: 5s
      retries: 3
    # Порт назовні не публікується: єдиний вхід — Caddy у тій самій мережі compose.
    logging:
      driver: json-file
      options: { max-size: '10m', max-file: '3' }
    restart: unless-stopped
```

### 2. `.github/workflows/deploy-admin-saas.yml`

- у `on.push.paths` і `on.pull_request.paths` прибрати `- 'landing/**'` (і коментар над ним);
- прибрати job `landing:` цілком;
- `needs: [build-test, entry, landing, e2e]` → `needs: [build-test, entry, e2e]`;
- у скрипті деплою `$COMPOSE build app entry landing` → `$COMPOSE build app entry`.

Блок «Презентаційна сторінка» з перевіркою healthcheck у скрипті **лишити**: він нічого
не збирає, а те, що контейнер піднявся, перевіряти й далі треба.

### 3. Прибрати вихідники

```bash
git rm -r landing
```

Каталог більше не потрібен: вміст, `Dockerfile` і `Caddyfile` живуть тут.

### 4. `admin-saas/Caddyfile`

Маршрут `handle_path /presentation/*` → `reverse_proxy landing:8080` лишається без змін.
Варто лише поправити коментар, який посилається на `landing/vite.config.js` — тепер це
`vite.config.js` репозиторію `arbitrio_landing`.
