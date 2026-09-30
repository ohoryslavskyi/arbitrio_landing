import { mount } from '@vue/test-utils';
import { afterEach, expect, it, vi } from 'vitest';
import { nextTick } from 'vue';
import App from '../../src/App.vue';
import { sections } from '../../src/data/content.js';
import { setLocale } from '../../src/i18n/index.js';
let wrapper;
afterEach(()=>{wrapper?.unmount();vi.unstubAllGlobals();});
it('renders all sections and resolves every internal navigation target in every language',async()=>{
 vi.stubGlobal('matchMedia',()=>({matches:true}));
 wrapper=mount(App);
 for(const lang of ['uk','ru','en','it']){
  setLocale(lang);await nextTick();
  const ids=wrapper.findAll('[id]').map(el=>el.attributes('id'));
  expect(new Set(ids).size).toBe(ids.length);
  for(const section of sections) expect(ids).toContain(section.id);
  for(const link of wrapper.findAll('a[href^="#"]')) expect(ids).toContain(link.attributes('href').slice(1));
  expect(wrapper.findAll('.hero-actions .btn')).toHaveLength(2);
  expect(wrapper.find('.hero-actions .btn--ghost').text()).toBe(wrapper.find('.cta-secondary').text());
 }
});
