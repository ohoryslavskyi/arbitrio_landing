<template>
  <span class="tile" :style="{ width: tile + 'px', height: tile + 'px' }">
    <svg
      class="mark"
      :width="size"
      :height="size"
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient :id="idL" x1="9" y1="41" x2="24" y2="11" gradientUnits="userSpaceOnUse">
          <stop stop-color="#1560D4" />
          <stop offset="1" stop-color="#3F97FF" />
        </linearGradient>
        <linearGradient :id="idR" x1="26" y1="11" x2="39" y2="41" gradientUnits="userSpaceOnUse">
          <stop stop-color="#9EE6FF" />
          <stop offset="1" stop-color="#33A8FF" />
        </linearGradient>
      </defs>

      <!--
        Кругла заглушка додає по 2.5 понад крайні точки, тому реальні межі знака —
        від y 8.5 до y 43.5, а це центр 26 при центрі viewBox 24. Зсув на -2
        ставить літеру рівно посередині плитки.
      -->
      <g transform="translate(0 -2)">
        <path class="leg-l" d="M9 41 L22.2 11" :stroke="`url(#${idL})`" stroke-width="5" stroke-linecap="round" />
        <path class="leg-r" d="M25.8 11 L39 41" :stroke="`url(#${idR})`" stroke-width="5" stroke-linecap="round" />
        <path class="leg-b" d="M16.4 30.6 L31.6 30.6" stroke="#4B9DFF" stroke-width="3.6" stroke-linecap="round" />
      </g>
    </svg>
  </span>
</template>

<script setup>
/**
 * Знак Arbitrio у плитці. Дві лінії, що сходяться в літеру A —
 * два ринки, які зустрічаються в одній ціні.
 *
 * Градієнти отримують унікальні id: інакше кілька знаків на сторінці
 * посилаються на один <defs> і в Safari колір злітає.
 */
const props = defineProps({
  size: { type: Number, default: 24 },
  tile: { type: Number, default: 38 },
});

const uid = Math.random().toString(36).slice(2, 8);
const idL = `mk-l-${uid}`;
const idR = `mk-r-${uid}`;
</script>

<style scoped>
.tile {
  display: grid;
  place-items: center;
  flex: none;
  border-radius: 10px;
  background: #0d1522;
  border: 1px solid rgba(47, 140, 255, .3);
}

:global([data-theme='light'] .tile) {
  background: #fff;
  border-color: rgba(47, 140, 255, .35);
  box-shadow: 0 1px 2px rgba(10, 15, 22, .06);
}

/* на світлому тлі крижана нога зникає — темнішаємо обидві */
:global([data-theme='light'] .leg-l) { stroke: #0c46a8; }
:global([data-theme='light'] .leg-r) { stroke: #1560d4; }
:global([data-theme='light'] .leg-b) { stroke: #2f8cff; }
</style>
