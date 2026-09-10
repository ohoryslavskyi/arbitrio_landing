# Хедер Arbitrio

Один хедер на два стани. Меню, знак і градієнт назви в обох станах однакові — змінюється
лише права група.

| Стан | Права група |
| --- | --- |
| Гість (не залогінений) | `Увійти` · `Отримати доступ` · іконка перемикача теми (сонце/місяць) |
| У системі (залогінений) | `Live` · сповіщення · перемикач `Темна / Світла` текстом |

Меню в обох станах: **Термінал · Дашборд · Налаштування · Про нас**.

## Розмітка

```html
<header class="hd" data-theme="dark">
  <a class="hd-brand" href="/">
    <span class="hd-tile">
      <svg class="hd-mark" width="24" height="24" viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="aL" x1="9" y1="41" x2="24" y2="11" gradientUnits="userSpaceOnUse">
          <stop stop-color="#1560D4"/><stop offset="1" stop-color="#3F97FF"/>
        </linearGradient>
        <linearGradient id="aR" x1="26" y1="11" x2="39" y2="41" gradientUnits="userSpaceOnUse">
          <stop stop-color="#9EE6FF"/><stop offset="1" stop-color="#33A8FF"/>
        </linearGradient>
      </defs>
      <path data-leg="l" d="M9 41 L22.2 11"     stroke="url(#aL)" stroke-width="5"   stroke-linecap="round"/>
      <path data-leg="r" d="M25.8 11 L39 41"    stroke="url(#aR)" stroke-width="5"   stroke-linecap="round"/>
      <path data-leg="b" d="M16.4 30.6 L31.6 30.6" stroke="#4B9DFF" stroke-width="3.6" stroke-linecap="round"/>
      </svg>
    </span>
    <span class="hd-text">
      <span class="hd-name">Arbitrio</span>
      <span class="hd-tag">Arbitrage control center</span>
    </span>
  </a>

  <span class="hd-divider"></span>

  <nav class="hd-nav">
    <a href="/terminal"  class="hd-link" aria-current="page">Термінал</a>
    <a href="/dashboard" class="hd-link">Дашборд</a>
    <a href="/settings"  class="hd-link">Налаштування</a>
    <a href="/about"     class="hd-link">Про нас</a>
  </nav>

  <span class="hd-spacer"></span>

  <!-- ГІСТЬ -->
  <div class="hd-actions">
    <a href="/login"  class="hd-ghost">Увійти</a>
    <a href="/signup" class="hd-cta">Отримати доступ</a>
    <button type="button" class="hd-icon" data-theme-toggle aria-label="Увімкнути світлу тему"></button>
  </div>

  <!-- У СИСТЕМІ -->
  <div class="hd-actions">
    <span class="hd-live"><span class="hd-live-dot"></span><span class="hd-live-label">Live</span></span>
    <button type="button" class="hd-icon" aria-label="Сповіщення"><span class="hd-dot"></span></button>
    <div class="hd-seg">
      <button type="button" class="hd-segbtn" data-active="true">Темна</button>
      <button type="button" class="hd-segbtn">Світла</button>
    </div>
  </div>
</header>
```

## Стилі

```css
.hd {
  display: flex; flex-wrap: wrap; align-items: center;
  gap: 12px 18px; min-height: 66px; padding: 12px 20px;
  background: #0A0F16; border-bottom: 1px solid rgba(255,255,255,.07);
}
.hd-brand   { display: flex; align-items: center; gap: 11px; flex: none; text-decoration: none; }
.hd-text    { display: flex; flex-direction: column; gap: 4px; }

/* знак живе в плитці — та сама рамка, що й у панелі */
.hd-tile {
  display: grid; place-items: center; flex: none;
  width: 38px; height: 38px; border-radius: 10px;
  background: #0D1522; border: 1px solid rgba(47,140,255,.3);
}
.hd-divider { flex: none; width: 1px; height: 26px; background: rgba(255,255,255,.09); }
.hd-nav     { display: flex; align-items: center; gap: 2px; flex: none; }
.hd-spacer  { flex: 1 1 0; min-width: 0; }
.hd-actions { display: flex; align-items: center; gap: 9px; flex: none; }

/* назва — той самий градієнт і кегль на всіх розмірах екрана */
.hd-name {
  font-family: 'Geist Mono', ui-monospace, monospace;
  font-size: 19px; font-weight: 700; letter-spacing: -0.045em; line-height: 1;
  background-image: linear-gradient(96deg, #F2F6FB 0px, #7FD4FF 104px);
  background-size: 104px 100%; background-repeat: no-repeat;
  -webkit-background-clip: text; background-clip: text; color: transparent;
}
.hd-tag {
  font-family: 'Geist Mono', ui-monospace, monospace;
  font-size: 8px; letter-spacing: .2em; text-transform: uppercase;
  line-height: 1; color: #5A6675;
}

.hd-link {
  padding: 8px 13px; border: 1px solid transparent; border-radius: 9px;
  font-size: 14px; font-weight: 500; color: #8996A8; white-space: nowrap;
  text-decoration: none; transition: color .18s, background .18s, border-color .18s;
}
.hd-link:hover { color: #F2F6FB; background: rgba(255,255,255,.05); }
.hd-link[aria-current="page"] { color: #F2F6FB; background: #131B28; border-color: rgba(255,255,255,.1); }

.hd-ghost {
  padding: 9px 15px; border: 1px solid rgba(255,255,255,.12); border-radius: 9px;
  font-size: 14px; font-weight: 500; color: #C7D3E2; white-space: nowrap; text-decoration: none;
}
.hd-ghost:hover { color: #F2F6FB; border-color: rgba(47,140,255,.45); }

.hd-cta {
  padding: 9px 17px; border-radius: 9px; background: #2F8CFF;
  font-size: 14px; font-weight: 600; color: #041020; white-space: nowrap; text-decoration: none;
}
.hd-cta:hover { background: #6AA8FF; }

.hd-icon {
  position: relative; display: grid; place-items: center;
  width: 36px; height: 36px; border-radius: 9px;
  background: #0D1522; border: 1px solid rgba(255,255,255,.09);
  color: #8996A8; cursor: pointer; transition: color .18s, border-color .18s;
}
.hd-icon:hover { color: #F2F6FB; border-color: rgba(47,140,255,.45); }
.hd-dot {
  position: absolute; top: 8px; right: 9px; width: 6px; height: 6px; border-radius: 50%;
  background: #FF7A4D; box-shadow: 0 0 0 2px #0A0F16;
}

.hd-live {
  display: flex; align-items: center; gap: 7px; padding: 7px 11px;
  border: 1px solid rgba(47,140,255,.26); border-radius: 8px; background: rgba(47,140,255,.08);
}
.hd-live-dot { width: 6px; height: 6px; border-radius: 50%; background: #2F8CFF; animation: dotPulse 2.4s ease-in-out infinite; }
.hd-live-label { font-family: 'Geist Mono', ui-monospace, monospace; font-size: 10px; letter-spacing: .12em; text-transform: uppercase; color: #8FBCFF; }
@keyframes dotPulse {
  0%, 100% { opacity: 1;  box-shadow: 0 0 0 0 rgba(47,140,255,.45); }
  50%      { opacity: .5; box-shadow: 0 0 0 5px rgba(47,140,255,0); }
}

.hd-seg { display: flex; gap: 2px; padding: 3px; border-radius: 9px; background: #0D1522; border: 1px solid rgba(255,255,255,.09); }
.hd-segbtn {
  padding: 7px 12px; border: 0; border-radius: 6px; background: transparent;
  font-family: 'Geist', system-ui, sans-serif; font-size: 14px; font-weight: 500;
  color: #8996A8; cursor: pointer; transition: background .18s, color .18s;
}
.hd-segbtn[data-active="true"] { background: #1C2635; color: #F2F6FB; }
```

## Світла тема

Перемикач ставить `data-theme="light"` на `.hd` (або на `<html>`, якщо тема глобальна).

```css
[data-theme="light"] .hd { background: #F5F7FA; border-bottom-color: rgba(10,15,22,.1); }
[data-theme="light"] .hd-name { background-image: linear-gradient(96deg, #0A0F16 0px, #1560D4 104px); }
[data-theme="light"] .hd-tag  { color: #6B7787; }

/* знак: темніші стопи, інакше права нога зникає на світлому */
[data-theme="light"] .hd-tile { background: #fff; border-color: rgba(47,140,255,.35); box-shadow: 0 1px 2px rgba(10,15,22,.06); }
[data-theme="light"] .hd-mark [data-leg="l"] { stroke: #0C46A8; }
[data-theme="light"] .hd-mark [data-leg="r"] { stroke: #1560D4; }
[data-theme="light"] .hd-mark [data-leg="b"] { stroke: #2F8CFF; }

[data-theme="light"] .hd-link { color: #55616F; }
[data-theme="light"] .hd-link:hover { color: #0A0F16; background: rgba(10,15,22,.05); }
[data-theme="light"] .hd-link[aria-current="page"] { color: #0A0F16; background: #fff; border-color: rgba(10,15,22,.12); box-shadow: 0 1px 2px rgba(10,15,22,.07); }
[data-theme="light"] .hd-ghost { color: #55616F; border-color: rgba(10,15,22,.14); }
[data-theme="light"] .hd-icon  { background: #fff; border-color: rgba(10,15,22,.12); color: #55616F; }
[data-theme="light"] .hd-dot   { box-shadow: 0 0 0 2px #F5F7FA; }
[data-theme="light"] .hd-live  { background: rgba(47,140,255,.12); border-color: rgba(21,96,212,.32); }
[data-theme="light"] .hd-live-label { color: #1560D4; }
[data-theme="light"] .hd-seg   { background: #E8ECF1; border-color: rgba(10,15,22,.1); }
[data-theme="light"] .hd-segbtn { color: #6B7787; }
[data-theme="light"] .hd-segbtn[data-active="true"] { background: #fff; color: #0A0F16; box-shadow: 0 1px 2px rgba(10,15,22,.1); }
```

## Перемикач теми

```js
const KEY = 'arbitrio-theme';
const root = document.documentElement;

const apply = (t) => {
  root.dataset.theme = t;
  document.querySelectorAll('.hd').forEach((h) => { h.dataset.theme = t; });
  localStorage.setItem(KEY, t);
};

apply(localStorage.getItem(KEY) || 'dark');

document.querySelectorAll('[data-theme-toggle]').forEach((btn) => {
  btn.addEventListener('click', () => {
    apply(root.dataset.theme === 'dark' ? 'light' : 'dark');
  });
});
```

Іконка кнопки показує **результат** натискання: у темній темі — сонце, у світлій — місяць.

```html
<!-- сонце -->
<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor"
     stroke-width="1.8" stroke-linecap="round">
  <circle cx="12" cy="12" r="4.2"/>
  <path d="M12 3v2.2"/><path d="M12 18.8V21"/><path d="M3 12h2.2"/><path d="M18.8 12H21"/>
  <path d="M5.6 5.6l1.6 1.6"/><path d="M16.8 16.8l1.6 1.6"/>
  <path d="M18.4 5.6l-1.6 1.6"/><path d="M7.2 16.8l-1.6 1.6"/>
</svg>

<!-- місяць -->
<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor"
     stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
  <path d="M20.5 14.6A8.6 8.6 0 1 1 9.4 3.5a6.9 6.9 0 0 0 11.1 11.1z"/>
</svg>
```

## Мобільний

До ~900 px хедер лишає знак і кнопку-бургер, меню розкривається вертикально: ті самі чотири
пункти, під ними `Увійти` і `Отримати доступ` у два стовпці. Кегль назви той самий — 19 px,
щоб градієнт лягав так само, як на десктопі.

Живий приклад усіх трьох станів — `Header.dc.html` у проєкті.
