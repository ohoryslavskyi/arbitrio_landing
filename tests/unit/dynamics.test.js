import { mount } from '@vue/test-utils';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { defineComponent, h, nextTick } from 'vue';
import { useScrollSpy } from '../../src/composables/useScrollSpy.js';
import { usePointerGrid } from '../../src/composables/usePointerGrid.js';
import { useLevelBars } from '../../src/composables/useLevelBars.js';
let wrapper, frames, time;
beforeEach(()=>{
 frames=new Map();time=0;let id=0;
 vi.stubGlobal('requestAnimationFrame',fn=>{frames.set(++id,fn);return id;});
 vi.stubGlobal('cancelAnimationFrame',id=>frames.delete(id));
 vi.stubGlobal('matchMedia',()=>({matches:false}));
 vi.spyOn(performance,'now').mockImplementation(()=>time);
});
afterEach(()=>{wrapper?.unmount();wrapper=null;document.body.innerHTML='';vi.unstubAllGlobals();vi.restoreAllMocks();});
async function frame(at=0){time=at;const queue=[...frames.values()];frames.clear();queue.forEach(fn=>fn(at));await nextTick();}
it('tracks scroll visibility, active section and the bottom of the page',async()=>{
 vi.stubGlobal('innerHeight',600);vi.stubGlobal('scrollY',0);
 Object.defineProperty(document.documentElement,'scrollHeight',{configurable:true,value:3000});
 for(const [id,top] of [['a',0],['b',900],['c',2400]]){const el=document.createElement('section');el.id=id;el.getBoundingClientRect=()=>({top:top-window.scrollY});document.body.append(el);}
 let state;wrapper=mount(defineComponent({setup(){state=useScrollSpy(['a','b','c'],{showAfter:400});return ()=>h('div');}}));
 expect(state.visible.value).toBe(false);expect(state.activeId.value).toBe('a');
 vi.stubGlobal('scrollY',950);window.dispatchEvent(new Event('scroll'));await frame();
 expect(state.visible.value).toBe(true);expect(state.activeId.value).toBe('b');
 vi.stubGlobal('scrollY',2400);window.dispatchEvent(new Event('scroll'));await frame();expect(state.activeId.value).toBe('c');
 wrapper.unmount();wrapper=null;window.dispatchEvent(new Event('scroll'));expect(frames.size).toBe(0);
});
it('lights grid cells for both pointer movement and touch-down, then cleans up listeners',async()=>{
 let state;wrapper=mount(defineComponent({setup(){state=usePointerGrid({initialCount:1});return ()=>h('div',{ref:state.gridEl},Array.from({length:state.cellCount.value},()=>h('span',{class:'cell'})));}}),{attachTo:document.body});
 state.gridEl.value.getBoundingClientRect=()=>({width:64,height:64,top:0});
 window.dispatchEvent(new Event('resize'));await frame();await nextTick();await frame();
 const send=(type,x)=>window.dispatchEvent(new MouseEvent(type,{clientX:x,clientY:0}));
 send('pointerdown',0);await frame();expect(wrapper.find('.cell').attributes('data-on')).toBe('1');
 send('pointermove',999);await frame();expect(wrapper.find('.cell').attributes('data-on')).toBe('0');
 wrapper.unmount();wrapper=null;frames.clear();send('pointerdown',0);expect(frames.size).toBe(0);
});
it('animates partner bars only after intersection and disconnects the observer',async()=>{
 let callback;const disconnect=vi.fn();vi.stubGlobal('IntersectionObserver',class{constructor(cb){callback=cb;}observe(){}disconnect=disconnect;});
 let state;wrapper=mount(defineComponent({setup(){state=useLevelBars({duration:500});return ()=>h('div',{ref:state.rootEl});}}));
 expect(state.progress.value).toBe(0);callback([{isIntersecting:false}]);expect(frames.size).toBe(0);
 callback([{isIntersecting:true}]);await frame(250);expect(state.progress.value).toBeGreaterThan(0);expect(state.progress.value).toBeLessThan(1);
 await frame(500);expect(state.progress.value).toBe(1);expect(disconnect).toHaveBeenCalledOnce();
});
it('shows final values with reduced motion even without IntersectionObserver',()=>{
 vi.stubGlobal('IntersectionObserver',undefined);vi.stubGlobal('matchMedia',()=>({matches:true}));
 let state;wrapper=mount(defineComponent({setup(){state=useLevelBars();return ()=>h('div',{ref:state.rootEl});}}));
 expect(state.progress.value).toBe(1);expect(frames.size).toBe(0);
});
