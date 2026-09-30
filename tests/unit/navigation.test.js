import { mount } from '@vue/test-utils';
import { afterEach, beforeEach, expect, it } from 'vitest';
import { nextTick } from 'vue';
import Header from '../../src/components/LandingHeader.vue';
import { initTheme } from '../../src/composables/useTheme.js';
import { setLocale } from '../../src/i18n/index.js';
let wrapper;
beforeEach(() => { localStorage.clear(); initTheme(); setLocale('uk'); wrapper = mount(Header, { attachTo: document.body }); });
afterEach(() => { wrapper.unmount(); document.body.innerHTML = ''; });
it('opens seven named sections without numbers and closes when navigating', async () => {
  await wrapper.find('.burger').trigger('click');
  expect(wrapper.findAll('#mobile-navigation a')).toHaveLength(7);
  expect(wrapper.find('.nav-number').exists()).toBe(false);
  await wrapper.find('#mobile-navigation a').trigger('click');
  expect(wrapper.find('#mobile-navigation').exists()).toBe(false);
});
it('keeps language and burger menus mutually exclusive', async () => {
  await wrapper.find('.burger').trigger('click');
  await wrapper.find('.language-trigger').trigger('click');
  expect(wrapper.find('#mobile-navigation').exists()).toBe(false);
  expect(wrapper.findAll('[role="menuitemradio"]')).toHaveLength(4);
  await wrapper.find('.burger').trigger('click');
  expect(wrapper.find('.language-options').exists()).toBe(false);
});
it('selects a language and closes the dropdown', async () => {
  await wrapper.find('.language-trigger').trigger('click');
  await wrapper.find('[data-language="en"]').trigger('click');
  expect(wrapper.find('.language-options').exists()).toBe(false);
  expect(wrapper.find('.language-trigger').text()).toBe('EN');
  expect(localStorage.getItem('arbitrio-language')).toBe('en');
});
it('supports keyboard navigation, Escape and outside clicks', async () => {
  const trigger = wrapper.find('.language-trigger'); trigger.element.focus();
  await trigger.trigger('keydown', { key: 'ArrowDown' });
  expect(document.activeElement.getAttribute('data-language')).toBe('uk');
  await wrapper.find('.language-picker').trigger('keydown', { key: 'End' });
  expect(document.activeElement.getAttribute('data-language')).toBe('it');
  await wrapper.find('.language-picker').trigger('keydown', { key: 'Escape' });
  expect(document.activeElement).toBe(trigger.element);
  await trigger.trigger('click');
  document.body.dispatchEvent(new Event('pointerdown', { bubbles: true })); await nextTick();
  expect(wrapper.find('.language-options').exists()).toBe(false);
});
it('closes the mobile menu on desktop resize and restores focus on Escape', async () => {
  await wrapper.find('.burger').trigger('click');
  await wrapper.find('.landing-header').trigger('keydown', { key: 'Escape' });
  expect(wrapper.find('#mobile-navigation').exists()).toBe(false);
  expect(document.activeElement).toBe(wrapper.find('.burger').element);
  await wrapper.find('.burger').trigger('click');
  const previous = window.innerWidth;
  Object.defineProperty(window, 'innerWidth', { configurable: true, value: 1440 });
  window.dispatchEvent(new Event('resize')); await nextTick();
  expect(wrapper.find('#mobile-navigation').exists()).toBe(false);
  Object.defineProperty(window, 'innerWidth', { configurable: true, value: previous });
});
it('toggles the theme from the real header button', async () => {
  await wrapper.find('.theme-toggle').trigger('click');
  expect(document.documentElement.dataset.theme).toBe('light');
  expect(localStorage.getItem('arbitrio-theme')).toBe('light');
  await wrapper.find('.theme-toggle').trigger('click');
  expect(document.documentElement.dataset.theme).toBe('dark');
});
