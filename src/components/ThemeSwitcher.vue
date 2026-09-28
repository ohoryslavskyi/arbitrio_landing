<template>
  <button class="theme-toggle" type="button" :aria-label="label" :title="label" @click="toggle">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">
      <path v-if="light" d="M20.5 14A8.5 8.5 0 0 1 10 3.5 8.5 8.5 0 1 0 20.5 14Z" />
      <g v-else><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/></g>
    </svg>
  </button>
</template>
<script setup>
import { ref, computed } from 'vue';
import { locale } from '../i18n/index.js';
const light = ref(document.documentElement.dataset.theme === 'light');
const labels = { uk: ['Світла тема', 'Темна тема'], ru: ['Светлая тема', 'Тёмная тема'], en: ['Light theme', 'Dark theme'], it: ['Tema chiaro', 'Tema scuro'] };
const label = computed(() => (labels[locale.value] || labels.uk)[light.value ? 1 : 0]);
function toggle() {
  light.value = !light.value;
  const theme = light.value ? 'light' : 'dark';
  document.documentElement.dataset.theme = theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', light.value ? '#edf2f8' : '#0b1220');
  try { localStorage.setItem('arbitrio-theme', theme); } catch {}
}
</script>
<style scoped>
.theme-toggle { flex: none; display: grid; place-items: center; width: 40px; height: 44px; padding: 0; border: 1px solid var(--hairline); border-radius: 10px; background: var(--surface); color: var(--ink-2); cursor: pointer; -webkit-tap-highlight-color: transparent; }
.theme-toggle svg { width: 19px; height: 19px; }
.theme-toggle:hover { background: var(--surface-hi); }
.theme-toggle:focus-visible { outline: 2px solid var(--blue); outline-offset: 2px; }
</style>
