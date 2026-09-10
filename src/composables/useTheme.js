import { onMounted, ref } from 'vue';

const KEY = 'arbitrio-theme';

/**
 * Темна / світла тема. Значення пишеться в data-theme на <html> і в localStorage,
 * тому вибір переживає перезавантаження.
 *
 * @returns {{ theme: import('vue').Ref<'dark'|'light'>, toggle: () => void, set: (t: 'dark'|'light') => void }}
 */
export function useTheme() {
  const theme = ref('dark');

  const set = (next) => {
    theme.value = next === 'light' ? 'light' : 'dark';
    if (typeof document !== 'undefined') {
      document.documentElement.dataset.theme = theme.value;
    }
    try {
      localStorage.setItem(KEY, theme.value);
    } catch {
      /* приватний режим — просто не запамʼятовуємо */
    }
  };

  const toggle = () => set(theme.value === 'dark' ? 'light' : 'dark');

  onMounted(() => {
    let saved = null;
    try {
      saved = localStorage.getItem(KEY);
    } catch {
      saved = null;
    }
    set(saved || 'dark');
  });

  return { theme, toggle, set };
}
