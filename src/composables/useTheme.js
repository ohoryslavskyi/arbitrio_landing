import { ref } from 'vue';
const KEY = 'arbitrio-theme';
/** @type {import('vue').Ref<'dark'|'light'>} */
const theme = ref('dark');
/** @param {unknown} next */
function set(next) {
  theme.value = next === 'light' ? 'light' : 'dark';
  document.documentElement.dataset.theme = theme.value;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme.value === 'light' ? '#edf2f8' : '#0b1220');
  try { localStorage.setItem(KEY, theme.value); } catch {}
}
export function initTheme() {
  let saved = document.documentElement.dataset.theme;
  try { saved = localStorage.getItem(KEY) || saved; } catch {}
  set(saved);
}
export function useTheme() { return { theme, set, toggle: () => set(theme.value === 'light' ? 'dark' : 'light') }; }
