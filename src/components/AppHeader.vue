<template>
  <header class="bar">
    <a href="/" class="brand-link">
      <BrandLockup />
    </a>

    <span class="divider" aria-hidden="true"></span>

    <nav class="nav">
      <a
        v-for="item in navItems"
        :key="item.id"
        :href="item.href"
        class="link"
        :class="{ 'link--active': item.id === active }"
        :aria-current="item.id === active ? 'page' : undefined"
      >{{ item.label }}</a>
    </nav>

    <span class="spacer" aria-hidden="true"></span>

    <!-- Гість: вхід, реєстрація, тема -->
    <div v-if="!authenticated" class="actions">
      <a href="/login" class="ghost">Увійти</a>
      <a href="/signup" class="cta">Отримати доступ</a>
      <button type="button" class="icon" :aria-label="themeLabel" :title="themeLabel" @click="toggle">
        <svg v-if="theme === 'dark'" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true">
          <circle cx="12" cy="12" r="4.2" />
          <path d="M12 3v2.2" /><path d="M12 18.8V21" /><path d="M3 12h2.2" /><path d="M18.8 12H21" />
          <path d="M5.6 5.6l1.6 1.6" /><path d="M16.8 16.8l1.6 1.6" />
          <path d="M18.4 5.6l-1.6 1.6" /><path d="M7.2 16.8l-1.6 1.6" />
        </svg>
        <svg v-else width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M20.5 14.6A8.6 8.6 0 1 1 9.4 3.5a6.9 6.9 0 0 0 11.1 11.1z" />
        </svg>
      </button>
    </div>

    <!-- У системі: стан звʼязку, сповіщення, тема -->
    <div v-else class="actions">
      <span class="live">
        <span class="live-dot"></span>
        <span class="live-label">Live</span>
      </span>

      <button type="button" class="icon" aria-label="Сповіщення">
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true">
          <path d="M18 8.5a6 6 0 1 0-12 0c0 6-2 7.5-2 7.5h16s-2-1.5-2-7.5" />
          <path d="M10.3 19.5a2 2 0 0 0 3.4 0" />
        </svg>
        <span v-if="unread" class="unread" aria-hidden="true"></span>
      </button>

      <div class="seg">
        <button type="button" class="segbtn" :class="{ 'segbtn--on': theme === 'dark' }" @click="set('dark')">Темна</button>
        <button type="button" class="segbtn" :class="{ 'segbtn--on': theme === 'light' }" @click="set('light')">Світла</button>
      </div>
    </div>
  </header>
</template>

<script setup>
import BrandLockup from './BrandLockup.vue';
import { useTheme } from '../composables/useTheme.js';
import { computed } from 'vue';

const props = defineProps({
  /** false — показує «Увійти / Отримати доступ»; true — Live і сповіщення */
  authenticated: { type: Boolean, default: false },
  /** id активного пункту меню */
  active: { type: String, default: 'terminal' },
  /** є непрочитані сповіщення */
  unread: { type: Boolean, default: true },
});

const { theme, toggle, set } = useTheme();

const navItems = [
  { id: 'terminal', label: 'Термінал', href: '/terminal' },
  { id: 'dashboard', label: 'Дашборд', href: '/dashboard' },
  { id: 'settings', label: 'Налаштування', href: '/settings' },
  { id: 'about', label: 'Про нас', href: '/about' },
];

const themeLabel = computed(() =>
  theme.value === 'dark' ? 'Увімкнути світлу тему' : 'Увімкнути темну тему');
</script>

<style scoped>
.bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px 18px;
  min-height: 66px;
  padding: 12px 20px;
  background: var(--surface);
  border-bottom: 1px solid var(--hairline);
}

/* Сам локап живе в BrandLockup.vue — тут лише його місце в рядку */
.brand-link { flex: none; }

.divider {
  flex: none;
  width: 1px;
  height: 26px;
  background: rgba(255, 255, 255, .09);
}

.nav {
  display: flex;
  align-items: center;
  gap: 2px;
  flex: none;
}

.link {
  padding: 8px 13px;
  border: 1px solid transparent;
  border-radius: 9px;
  font-size: 14px;
  font-weight: 500;
  color: var(--ink-5);
  white-space: nowrap;
  transition: color .18s, background .18s, border-color .18s;
}
.link:hover { color: var(--ink); background: rgba(255, 255, 255, .05); }

.link--active {
  color: var(--ink);
  background: #131b28;
  border-color: rgba(255, 255, 255, .1);
}

.spacer { flex: 1 1 0; min-width: 0; }

.actions {
  display: flex;
  align-items: center;
  gap: 9px;
  flex: none;
}

.ghost {
  padding: 9px 15px;
  border: 1px solid rgba(255, 255, 255, .12);
  border-radius: 9px;
  font-size: 14px;
  font-weight: 500;
  color: var(--ink-2);
  white-space: nowrap;
  transition: color .18s, border-color .18s;
}
.ghost:hover { color: var(--ink); border-color: rgba(47, 140, 255, .45); }

.cta {
  padding: 9px 17px;
  border-radius: 9px;
  background: var(--blue);
  font-size: 14px;
  font-weight: 600;
  color: var(--on-blue);
  white-space: nowrap;
  transition: background .18s;
}
.cta:hover { background: var(--blue-hi); color: var(--on-blue); }

.icon {
  position: relative;
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  border-radius: 9px;
  background: #0d1522;
  border: 1px solid rgba(255, 255, 255, .09);
  color: var(--ink-5);
  cursor: pointer;
  transition: color .18s, border-color .18s;
}
.icon:hover { color: var(--ink); border-color: rgba(47, 140, 255, .45); }

.unread {
  position: absolute;
  top: 8px;
  right: 9px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #ff7a4d;
  box-shadow: 0 0 0 2px var(--surface);
}

.live {
  display: flex;
  align-items: center;
  gap: 7px;
  flex: none;
  padding: 7px 11px;
  border: 1px solid rgba(47, 140, 255, .26);
  border-radius: 8px;
  background: rgba(47, 140, 255, .08);
}

.live-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--blue);
  animation: dotPulse 2.4s ease-in-out infinite;
}

.live-label {
  font-family: var(--mono);
  font-size: 10px;
  letter-spacing: .12em;
  text-transform: uppercase;
  color: var(--blue-text);
}

.seg {
  display: flex;
  gap: 2px;
  flex: none;
  padding: 3px;
  border-radius: 9px;
  background: #0d1522;
  border: 1px solid rgba(255, 255, 255, .09);
}

.segbtn {
  padding: 7px 12px;
  border: 0;
  border-radius: 6px;
  background: transparent;
  font-family: var(--font);
  font-size: 14px;
  font-weight: 500;
  color: var(--ink-5);
  cursor: pointer;
  transition: background .18s, color .18s;
}
.segbtn--on { background: #1c2635; color: var(--ink); }

/* ---------- світла тема ---------- */

:global([data-theme='light']) .bar {
  background: #f5f7fa;
  border-bottom-color: rgba(10, 15, 22, .1);
}
:global([data-theme='light']) .divider { background: rgba(10, 15, 22, .12); }
:global([data-theme='light']) .link { color: #55616f; }
:global([data-theme='light']) .link:hover { color: #0a0f16; background: rgba(10, 15, 22, .05); }
:global([data-theme='light']) .link--active {
  color: #0a0f16;
  background: #fff;
  border-color: rgba(10, 15, 22, .12);
  box-shadow: 0 1px 2px rgba(10, 15, 22, .07);
}
:global([data-theme='light']) .ghost { color: #55616f; border-color: rgba(10, 15, 22, .14); }
:global([data-theme='light']) .ghost:hover { color: #0a0f16; border-color: rgba(47, 140, 255, .45); }
:global([data-theme='light']) .icon { background: #fff; border-color: rgba(10, 15, 22, .12); color: #55616f; }
:global([data-theme='light']) .icon:hover { color: #0a0f16; border-color: rgba(47, 140, 255, .45); }
:global([data-theme='light']) .unread { box-shadow: 0 0 0 2px #f5f7fa; }
:global([data-theme='light']) .live { background: rgba(47, 140, 255, .12); border-color: rgba(21, 96, 212, .32); }
:global([data-theme='light']) .live-label { color: #1560d4; }
:global([data-theme='light']) .seg { background: #e8ecf1; border-color: rgba(10, 15, 22, .1); }
:global([data-theme='light']) .segbtn { color: #6b7787; }
:global([data-theme='light']) .segbtn--on { background: #fff; color: #0a0f16; box-shadow: 0 1px 2px rgba(10, 15, 22, .1); }

/* ---------- мобільний ---------- */

@media (max-width: 900px) {
  .bar { gap: 10px 12px; }
  /* :deep — підпис живе всередині BrandLockup, у тісній шапці він зайвий */
  .brand-link :deep(.brand-tag) { display: none; }
  .nav { order: 3; width: 100%; overflow-x: auto; scrollbar-width: none; }
  .nav::-webkit-scrollbar { height: 0; }
  .spacer { display: none; }
  .actions { margin-left: auto; }
}
</style>
