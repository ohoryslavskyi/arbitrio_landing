import { mount } from '@vue/test-utils';
import { afterEach, beforeEach, expect, it } from 'vitest';
import Team from '../../src/components/TeamSection.vue';
import { nextTick } from 'vue';
let wrapper, viewport;
const point = (x,y=0) => ({clientX:x,clientY:y});
async function touch(type, touches) {
  const event = new Event(type,{bubbles:true,cancelable:true});
  Object.defineProperty(event,'touches',{value:touches});
  viewport.dispatchEvent(event); await nextTick(); return event;
}
beforeEach(()=>{wrapper=mount(Team);viewport=wrapper.find('.team-image-viewport').element;viewport.getBoundingClientRect=()=>({width:300,height:200});});
afterEach(()=>wrapper.unmount());
it('allows normal one-finger scrolling before zoom',async()=>{
  await touch('touchstart',[point(10)]);const event=await touch('touchmove',[point(50)]);
  expect(event.defaultPrevented).toBe(false);expect(wrapper.find('.team-reset').exists()).toBe(false);
});
it('clamps pinch zoom to 1–4 and resets the image',async()=>{
  await touch('touchstart',[point(0),point(100)]);
  const event=await touch('touchmove',[point(0),point(1000)]);
  expect(event.defaultPrevented).toBe(true);
  expect(wrapper.find('img').attributes('style')).toContain('scale(4)');
  await touch('touchmove',[point(0),point(10)]);
  expect(wrapper.find('img').attributes('style')).toContain('scale(1)');
  await touch('touchmove',[point(0),point(200)]);
  await wrapper.find('.team-reset').trigger('click');
  expect(wrapper.find('img').attributes('style')).toContain('translate(0px, 0px) scale(1)');
  expect(wrapper.find('.team-reset').exists()).toBe(false);
});
it('bounds panning and clears a cancelled gesture',async()=>{
  await touch('touchstart',[point(0),point(100)]);await touch('touchmove',[point(0),point(200)]);
  await touch('touchend',[point(0)]);await touch('touchmove',[point(1000,1000)]);
  expect(wrapper.find('img').attributes('style')).toContain('translate(150px, 100px) scale(2)');
  await touch('touchcancel',[]);const event=await touch('touchmove',[point(0)]);
  expect(event.defaultPrevented).toBe(false);
});
