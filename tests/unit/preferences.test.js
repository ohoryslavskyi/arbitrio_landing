import { beforeEach, describe, expect, it, vi } from 'vitest';
import { nextTick } from 'vue';
import uk from '../../src/i18n/uk.json';
import ru from '../../src/i18n/ru.json';
import en from '../../src/i18n/en.json';
import itMessages from '../../src/i18n/it.json';

beforeEach(() => {
  vi.resetModules(); localStorage.clear();
  delete document.documentElement.dataset.theme;
  document.head.innerHTML = '<meta name="theme-color"><meta name="description">';
});
describe('theme preferences', () => {
  it('restores light theme on a fresh application start without an inline script', async () => {
    localStorage.setItem('arbitrio-theme', 'light');
    const { initTheme, useTheme } = await import('../../src/composables/useTheme.js');
    initTheme();
    expect(useTheme().theme.value).toBe('light');
    expect(document.documentElement.dataset.theme).toBe('light');
    expect(document.querySelector('[name="theme-color"]').content).toBe('#edf2f8');
  });
  it('shares state, toggles and persists the selection', async () => {
    const { initTheme, useTheme } = await import('../../src/composables/useTheme.js');
    initTheme(); const first = useTheme(), second = useTheme();
    first.toggle(); expect(second.theme.value).toBe('light');
    expect(localStorage.getItem('arbitrio-theme')).toBe('light');
    second.toggle(); expect(document.documentElement.dataset.theme).toBe('dark');
  });
  it('uses dark for invalid storage and survives unavailable storage', async () => {
    localStorage.setItem('arbitrio-theme', 'invalid');
    const { initTheme, useTheme } = await import('../../src/composables/useTheme.js');
    initTheme(); expect(useTheme().theme.value).toBe('dark');
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('blocked'); });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('blocked'); });
    expect(() => { initTheme(); useTheme().toggle(); }).not.toThrow();
    expect(document.documentElement.dataset.theme).toBe('light');
  });
});
describe('translations', () => {
  it.each(Object.entries({ uk, ru, en, it: itMessages }))('%s has all keys and nonempty translations', (_, messages) => {
    expect(Object.keys(messages).sort()).toEqual(Object.keys(uk).sort());
    expect(Object.values(messages).every(value => typeof value === 'string' && value.trim())).toBe(true);
    expect(messages.m004).toBe(messages.m011);
  });
  it('restores the language, updates metadata and rejects unknown locales', async () => {
    localStorage.setItem('arbitrio-language', 'it');
    const { locale, setLocale, t } = await import('../../src/i18n/index.js');
    expect(locale.value).toBe('it'); expect(document.documentElement.lang).toBe('it');
    setLocale('en'); await nextTick();
    expect(t('m011')).toBe('Try demo'); expect(t(uk.m011)).toBe('Try demo');
    expect(document.title).toContain(en.m006);
    expect(document.querySelector('[name="description"]').content).toBe(en.m009);
    expect(localStorage.getItem('arbitrio-language')).toBe('en');
    setLocale('unknown'); expect(locale.value).toBe('en');
    expect(t('unknown-key')).toBe('unknown-key');
  });
  it('works when storage is blocked', async () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('blocked'); });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('blocked'); });
    const { locale, setLocale } = await import('../../src/i18n/index.js');
    expect(locale.value).toBe('uk'); setLocale('ru'); await nextTick();
    expect(document.documentElement.lang).toBe('ru');
  });
});
