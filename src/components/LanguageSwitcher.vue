<template>
  <div ref="root" class="language-picker" @keydown="onKeydown" @focusout="onFocusout">
    <button ref="trigger" class="language-trigger" type="button" aria-haspopup="menu"
      :aria-expanded="open" aria-controls="language-options" aria-label="Language / Мова / Язык / Lingua"
      @click="toggle">
      <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c5 5 5 13 0 18-5-5-5-13 0-18Z"/></svg>
      <span>{{ languages.find(item => item.code === locale)?.short }}</span>
      <span class="chevron" :class="{ 'chevron--open': open }" aria-hidden="true"></span>
    </button>
    <div v-if="open" id="language-options" class="language-options" role="menu" aria-label="Language / Мова / Язык / Lingua">
      <button v-for="language in languages" :key="language.code" type="button" role="menuitemradio"
        :aria-checked="locale === language.code" :lang="language.code" :data-language="language.code"
        :class="{ selected: locale === language.code }" @click="choose(language.code)">
        <span class="language-code">{{ language.short }}</span>
        <span>{{ language.label }}</span>
        <span class="language-check" aria-hidden="true">{{ locale === language.code ? '✓' : '' }}</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick, onMounted, onBeforeUnmount } from 'vue';
import { languages, locale, setLocale } from '../i18n/index.js';
const emit = defineEmits(['opened']);
const open = ref(false);
/** @type {import('vue').Ref<HTMLElement|null>} */
const root = ref(null);
/** @type {import('vue').Ref<HTMLButtonElement|null>} */
const trigger = ref(null);
function close(restore = false) { open.value = false; if (restore) trigger.value?.focus(); }
function toggle() { open.value = !open.value; if (open.value) emit('opened'); }
function choose(code) { setLocale(code); close(true); }
function outside(event) { if (!root.value?.contains(event.target)) close(); }
function onFocusout(event) { if (event.relatedTarget && !root.value?.contains(event.relatedTarget)) close(); }
async function onKeydown(event) {
  if (event.key === 'Escape' && open.value) { event.preventDefault(); event.stopPropagation(); close(true); return; }
  if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;
  event.preventDefault();
  if (!open.value) { open.value = true; emit('opened'); await nextTick(); }
  if (!root.value) return;
  const items = [...root.value.querySelectorAll('button[role="menuitemradio"]')];
  const index = items.findIndex(item => item === document.activeElement);
  const next = event.key === 'Home' ? 0 : event.key === 'End' ? items.length - 1
    : event.key === 'ArrowDown' ? (index + 1) % items.length : (index < 0 ? items.length - 1 : (index - 1 + items.length) % items.length);
  if (items[next] instanceof HTMLElement) items[next].focus();
}
onMounted(() => document.addEventListener('pointerdown', outside));
onBeforeUnmount(() => document.removeEventListener('pointerdown', outside));
defineExpose({ close });
</script>

<style scoped>
.language-picker { position: relative; flex: none; }
button { -webkit-appearance: none; appearance: none; font: inherit; color: var(--ink-2); cursor: pointer; -webkit-tap-highlight-color: transparent; }
.language-trigger { display: flex; align-items: center; justify-content: center; gap: 8px; min-height: 40px; padding: 0 10px; border: 1px solid var(--hairline); border-radius: 10px; background: var(--surface); font: 500 13px var(--font); }
.language-trigger svg { width: 17px; height: 17px; fill: none; stroke: currentColor; stroke-width: 1.5; }
.chevron { display: block; width: 0; height: 0; margin-left: 1px; border-left: 2px solid transparent; border-right: 2px solid transparent; border-top: 3px solid var(--ink-3); transition: transform .2s; }
.chevron--open { transform: rotate(180deg); }
.language-options { position: absolute; top: calc(100% + 10px); right: 0; width: 218px; max-width: calc(100vw - 24px); padding: 6px; border: 1px solid var(--blue-line); border-radius: 14px; background: var(--surface-hi); box-shadow: 0 18px 48px rgba(0,0,0,.45); }
.language-options button { display: flex; align-items: center; gap: 12px; width: 100%; min-height: 46px; padding: 10px; border: 0; border-radius: 9px; background: transparent; font-size: 14px; text-align: left; }
.language-code { width: 25px; font: 11px var(--mono); color: var(--ink-5); }
.language-check { margin-left: auto; color: var(--blue-hi); }
.language-options .selected { background: rgba(47,140,255,.12); color: var(--blue-text); }
button:focus { outline: none; }
button:focus-visible { outline: 2px solid var(--blue-hi); outline-offset: -3px; }
@media (hover: hover) { .language-trigger:hover { background: var(--surface-hi); } .language-options button:hover { background: var(--row-hover); } }
@media (prefers-reduced-motion: reduce) { .chevron { transition: none; } }
</style>

<style scoped>
/* Keep the popup inside narrow screens when the theme button sits beside it. */
@media (max-width: 480px) {
  .language-options { position: fixed; top: 66px; right: 12px; }
}
</style>
