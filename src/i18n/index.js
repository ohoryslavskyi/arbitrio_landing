import { ref, watch } from 'vue';
import uk from './uk.json';
import ru from './ru.json';
import en from './en.json';
import it from './it.json';

export const languages = [
  { code: 'uk', label: 'Українська', short: 'UA' },
  { code: 'ru', label: 'Русский', short: 'RU' },
  { code: 'en', label: 'English', short: 'EN' },
  { code: 'it', label: 'Italiano', short: 'IT' },
];
const messages = { uk, ru, en, it };
const sourceKeys = new Map(Object.entries(uk).map(([key, value]) => [value, key]));
let initial = 'uk';
try {
  const saved = localStorage.getItem('arbitrio-language');
  if (saved && Object.prototype.hasOwnProperty.call(messages, saved)) initial = saved;
} catch { /* Storage may be unavailable in private or embedded browsers. */ }
export const locale = ref(initial);
export function setLocale(value) {
  if (Object.prototype.hasOwnProperty.call(messages, value)) locale.value = value;
}
/** @param {string} source */
export function t(source) {
  const key = sourceKeys.get(source) || source;
  return messages[locale.value]?.[key] ?? uk[key] ?? source;
}
watch(locale, value => {
  document.documentElement.lang = value;
  document.title = `Arbitr.IO — ${t('m006')}`;
  document.querySelector('meta[name="description"]')?.setAttribute('content', t('m009'));
  try { localStorage.setItem('arbitrio-language', value); } catch { /* Keep session selection. */ }
}, { immediate: true });
