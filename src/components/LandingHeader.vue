<template>
  <header ref="root" class="landing-header" @keydown.esc="closeMenu(true)">
    <div class="header-inner">
      <button ref="burger" class="burger" type="button" :aria-expanded="menuOpen" aria-controls="mobile-navigation"
        :aria-label="t('m048')" @click="toggleMenu">
        <span :class="{ 'burger-lines--open': menuOpen }" class="burger-lines" aria-hidden="true"><i></i><i></i><i></i></span>
      </button>
      <a class="header-brand" href="#top" :aria-label="t('m049')" @click="closeMenu()"><BrandLockup /></a>
      <LanguageSwitcher ref="language" @opened="closeMenu()" />
      <ThemeSwitcher />
    </div>
    <nav v-if="menuOpen" id="mobile-navigation" class="mobile-navigation" :aria-label="t('m048')">
      <a v-for="item in sections" :key="item.id" :href="`#${item.id}`" @click="navigate(item.id)">
        <span>{{ t(item.label) }}</span><span class="nav-arrow" aria-hidden="true">↗</span>
      </a>
    </nav>
  </header>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import BrandLockup from './BrandLockup.vue';
import ThemeSwitcher from './ThemeSwitcher.vue';
import LanguageSwitcher from './LanguageSwitcher.vue';
import { sections } from '../data/content.js';
import { t } from '../i18n/index.js';
const root = ref(null), burger = ref(null), language = ref(null), menuOpen = ref(false);
function closeMenu(restore = false) { if (!menuOpen.value) return; menuOpen.value = false; if (restore) burger.value?.focus(); }
function toggleMenu() { language.value?.close(); menuOpen.value = !menuOpen.value; }
function navigate(id) {
  closeMenu();
  const section = document.getElementById(id);
  if (section) { section.setAttribute('tabindex', '-1'); section.focus({ preventScroll: true }); }
}
function outside(event) { if (!root.value?.contains(event.target)) closeMenu(); }
function resize() { if (window.innerWidth >= 1200) closeMenu(); }
onMounted(() => { document.addEventListener('pointerdown', outside); window.addEventListener('resize', resize); });
onBeforeUnmount(() => { document.removeEventListener('pointerdown', outside); window.removeEventListener('resize', resize); });
</script>

<style scoped>
.landing-header { position: sticky; top: 0; z-index: 100; background: var(--header-bg); border-bottom: 1px solid var(--hairline); -webkit-backdrop-filter: blur(16px); backdrop-filter: blur(16px); }
.header-inner { display: flex; align-items: center; gap: 12px; max-width: var(--wrap); margin: auto; padding: 10px max(16px, env(safe-area-inset-right)) 10px max(16px, env(safe-area-inset-left)); }
.header-brand { display: flex; align-items: center; gap: 10px; min-width: 0; margin-right: auto; color: var(--ink); font: 700 20px var(--mono); letter-spacing: -.04em; }
.burger { flex: none; display: none; align-items: center; justify-content: center; width: 44px; height: 44px; padding: 0; border: 1px solid var(--hairline); border-radius: 10px; background: var(--surface); color: var(--ink-2); cursor: pointer; -webkit-appearance: none; -webkit-tap-highlight-color: transparent; }
.burger-lines { display: grid; gap: 5px; width: 19px; }
.burger-lines i { height: 1px; background: currentColor; transition: transform .2s, opacity .2s; }
.burger-lines--open i:first-child { transform: translateY(6px) rotate(45deg); }
.burger-lines--open i:nth-child(2) { opacity: 0; }
.burger-lines--open i:last-child { transform: translateY(-6px) rotate(-45deg); }
.mobile-navigation { position: absolute; top: 100%; left: 0; right: 0; display: grid; padding: 10px 16px 16px; padding-bottom: max(16px, env(safe-area-inset-bottom)); max-height: calc(100vh - 66px); max-height: calc(100dvh - 66px); overflow-y: auto; overscroll-behavior: contain; background: var(--surface); border-bottom: 1px solid var(--blue-line); box-shadow: 0 18px 35px rgba(0,0,0,.4); }
.mobile-navigation a { display: flex; align-items: center; gap: 14px; min-height: 48px; padding: 10px 12px; color: var(--ink-2); border-radius: 9px; font-size: 15px; }
.nav-number { font: 10px var(--mono); color: var(--ink-muted); }
.nav-arrow { margin-left: auto; color: var(--blue-text); }
.burger:focus { outline: none; }
.burger:focus-visible, .header-brand:focus-visible, .mobile-navigation a:focus-visible { outline: 2px solid var(--blue-hi); outline-offset: -3px; }
@media (hover: hover) { .mobile-navigation a:hover, .burger:hover { background: var(--surface-hi); } }
@media (max-width: 1199px) { .burger { display: flex; } }
@media (max-width: 360px) { .header-inner { gap: 8px; padding-left: 10px; padding-right: 10px; } .header-brand { gap: 6px; font-size: 16px; } }
@media (max-width: 270px) { .brand-word { display: none; } .header-brand { font-size: 13px; } .header-inner { gap: 5px; padding-left: 6px; padding-right: 6px; } }
@media (prefers-reduced-motion: reduce) { .burger-lines i { transition: none; } }
.header-brand :deep(.brand) { min-width: 0; }
@media (max-width: 600px) { .header-brand :deep(.brand-tag) { display: none; } .header-brand :deep(.brand) { gap: 7px; } }
@media (max-width: 380px) { .header-brand :deep(.brand-text) { display: none; } }
@media (min-width: 1200px) {
  .landing-header { position: fixed; top: 20px; right: 24px; background: transparent; border: 0; backdrop-filter: none; -webkit-backdrop-filter: none; }
  .header-inner { padding: 0; gap: 8px; }
  .header-brand { display: none; }
}
</style>
