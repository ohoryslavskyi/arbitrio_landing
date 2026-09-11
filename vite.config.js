import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  // Сторінка живе не на апексі, а на підшляху: `arbitrio.net/presentation/`.
  // Апекс зайнятий вхідними дверима системи, і забирати його в лендінгу не можна —
  // це єдиний вхід клієнтів.
  //
  // ⚠️ `base` — не косметика: із ним Vite переписує ВСІ абсолютні посилання на статику
  // (і в `index.html`, і в шаблонах компонентів, включно з `/team-masks.png`), тож
  // зібрана сторінка просить `/presentation/assets/…`, а не `/assets/…`. Без нього
  // браузер стукав би в корінь, тобто у двері, і отримував би форму входу замість
  // скрипта.
  //
  // 🔴 Значення мусить збігатися з маршрутом у публічному Caddy монорепи ArbBot
  // (`handle_path /presentation/*` в `admin-saas/Caddyfile`). Розійдуться — сторінка
  // віддасть порожній екран. Саме це й стереже крок «base path matches» у пайплайні.
  base: '/presentation/',
  plugins: [vue()],
});
