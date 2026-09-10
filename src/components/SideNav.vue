<template>
  <!-- Рейка проявляється після hero і ховається, коли скрол повертається вгору -->
  <nav
    class="rail"
    :class="{ 'rail--on': visible }"
    aria-label="Розділи сторінки"
    :aria-hidden="visible ? undefined : 'true'"
  >
    <a
      v-for="item in sideNavItems"
      :key="item.id"
      :href="`#${item.id}`"
      class="rail-item"
      :class="{ 'rail-item--active': item.id === activeId }"
      :aria-current="item.id === activeId ? 'true' : undefined"
      :tabindex="visible ? undefined : -1"
    >
      <span class="rail-label">{{ item.label }}</span>
      <span class="rail-dot" aria-hidden="true"></span>
    </a>
  </nav>
</template>

<script setup>
import { sideNavItems } from '../data/content.js';
import { useScrollSpy } from '../composables/useScrollSpy.js';

const { visible, activeId } = useScrollSpy(sideNavItems.map((i) => i.id));
</script>

<style scoped>
.rail {
  position: fixed;
  top: 50%;
  right: 22px;
  z-index: 40;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
  opacity: 0;
  visibility: hidden;
  transform: translateY(-50%) translateX(14px);
  transition: opacity .38s var(--ease), transform .38s var(--ease), visibility .38s;
}

.rail--on {
  opacity: 1;
  visibility: visible;
  transform: translateY(-50%) translateX(0);
}

.rail-item {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  padding: 5px 0;
  color: inherit;
}

/* Підпис лежить у власній плашці й проявляється лише при наведенні на рейку,
   тому в спокої на дизайн не впливає нічого, крім ряду крапок. */
.rail-label {
  padding: 3px 9px;
  border-radius: 7px;
  border: 1px solid transparent;
  background: rgba(5, 7, 12, .74);
  backdrop-filter: blur(7px);
  -webkit-backdrop-filter: blur(7px);
  font-size: 12.5px;
  line-height: 1.35;
  white-space: nowrap;
  color: var(--ink-5);
  opacity: 0;
  transform: translateX(6px);
  pointer-events: none;
  transition: opacity .26s var(--ease), transform .26s var(--ease), color .2s;
}

.rail:hover .rail-label,
.rail:focus-within .rail-label {
  opacity: 1;
  transform: translateX(0);
}

.rail-item:hover .rail-label { color: var(--ink); }

.rail-item--active .rail-label {
  color: var(--blue-text);
  border-color: rgba(47, 140, 255, .26);
}

.rail-dot {
  flex: none;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: rgba(255, 255, 255, .2);
  transition: background .24s, transform .24s var(--ease), box-shadow .24s;
}

.rail-item:hover .rail-dot {
  background: var(--blue-hi);
  transform: scale(1.25);
}

.rail-item--active .rail-dot {
  background: var(--blue);
  transform: scale(1.35);
  box-shadow: 0 0 0 4px rgba(47, 140, 255, .14);
}

/* Клавіатурний фокус має бути видимим навіть без hover */
.rail-item:focus-visible {
  outline: none;
}
.rail-item:focus-visible .rail-label {
  opacity: 1;
  transform: translateX(0);
  color: var(--ink);
  border-color: var(--blue-line);
}

/* Місця в бічному полі вистачає лише на широких екранах: --wrap 1240px */
@media (max-width: 1199px) {
  .rail { display: none; }
}

@media (prefers-reduced-motion: reduce) {
  .rail,
  .rail-label,
  .rail-dot { transition: none; }
  .rail-item:hover .rail-dot,
  .rail-item--active .rail-dot { transform: none; }
}
</style>
