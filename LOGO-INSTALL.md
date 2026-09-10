# Як підключити

## 1. Скопіювати файли

Іконки мусять лежати в корені сайту — браузери шукають `/favicon.ico` та `/favicon.svg` саме там.

```bash
# з кореня репозиторію
cp favicon.ico favicon.svg favicon-16.png favicon-32.png favicon-48.png \
   apple-touch-icon.png favicon-192.png favicon-512.png \
   site.webmanifest og-image.png  public/

mkdir -p public/logo
cp arbitrio-mark.svg arbitrio-mark-flat.svg arbitrio-mark-mono.svg \
   arbitrio-lockup.svg  public/logo/
```

Якщо статику роздає не `public/`, а `static/` (Nuxt 2), `assets/` (Django) або корінь (звичайний
хостинг) — покладіть туди, шлях у `<head>` має починатися з `/`.

## 2. Вставити в `<head>`

```html
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16.png">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<meta name="theme-color" content="#0B1220">

<title>Arbitrio — автоматизований криптовалютний арбітраж</title>
<meta name="description" content="Arbitrio — платформа автоматизованого криптовалютного арбітражу: демо-режим, партнерська програма до 90% від PnL, прозорі тарифи.">

<meta property="og:type" content="website">
<meta property="og:url" content="https://arbitrio.net/">
<meta property="og:title" content="Arbitrio — автоматизований криптовалютний арбітраж">
<meta property="og:description" content="Демо-режим без реальних коштів, партнерська програма до 90% від PnL, прозорі тарифи.">
<meta property="og:image" content="https://arbitrio.net/og-image.png">
<meta name="twitter:card" content="summary_large_image">
```

## 3. Знак у хедері

```html
<a href="/" class="brand">
  <img src="/logo/arbitrio-mark.svg" width="30" height="30" alt="">
  <span class="brand-name">Arbitrio</span>
</a>
```

```css
.brand { display: flex; align-items: center; gap: 11px; text-decoration: none; }
.brand-name {
  font-family: 'Geist Mono', ui-monospace, monospace;
  font-size: 19px;
  font-weight: 700;
  letter-spacing: -0.045em;
  background-image: linear-gradient(96deg, #F2F6FB 20%, #7FD4FF 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
/* світла тема */
[data-theme="light"] .brand-name {
  background-image: linear-gradient(96deg, #0A0F16 22%, #1560D4 100%);
}
```

Готовий хедер (десктоп + мобільний, з перемикачем теми) лежить у `Header.dc.html` цього проєкту —
розмітку можна забрати звідти цілком.

## 4. Запушити

```bash
git checkout -b feat/logo-arbitrio
git add public/favicon* public/apple-touch-icon.png public/site.webmanifest \
        public/og-image.png public/logo index.html
git commit -m "feat(brand): новий знак і favicon Arbitrio, назва одним словом"
git push -u origin feat/logo-arbitrio
```

## 5. Перевірити після деплою

- Вкладка браузера — знак, а не глобус. Якщо стара іконка залишилась: Ctrl+Shift+R,
  браузери кешують favicon агресивно, інколто добу.
- `https://arbitrio.net/og-image.png` відкривається напряму.
- Посилання в Telegram показує превʼю з назвою.
- Ярлик на iPhone («На початковий екран») — знак на темній підкладці, без білих кутів.
- Знак у хедері читається на 100% і на 200% зумі.

## Найкоротший шлях

Якщо не хочеться правити `<head>` — покладіть один `favicon.ico` у корінь сайту. Браузери
знайдуть його самі, без жодного тега. Решта файлів тоді додається пізніше, коли буде час.
