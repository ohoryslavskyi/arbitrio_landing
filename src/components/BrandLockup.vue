<template>
  <span class="brand">
    <BrandMark :size="size" :tile="tile" />
    <span class="brand-text">
      <span class="brand-name">Arbitrio</span>
      <span class="brand-tag">Arbitrage control center</span>
    </span>
  </span>
</template>

<script setup>
import BrandMark from './BrandMark.vue';

/**
 * Локап бренду: знак + назва + підпис. Один компонент на всі місця, де
 * зʼявляється логотип, — шапка й футер не можуть розʼїхатись у стилях.
 */
defineProps({
  size: { type: Number, default: 24 },
  tile: { type: Number, default: 38 },
});
</script>

<style scoped>
.brand {
  display: flex;
  align-items: center;
  gap: 11px;
  flex: none;
}

.brand-text {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

/* Градієнт прив'язаний до пікселів, а не до відсотків: інакше він
   розтягується під розмір елемента й на різних кеглях виглядає інакше. */
.brand-name {
  font-family: var(--mono);
  font-size: 19px;
  font-weight: 700;
  line-height: 1;
  letter-spacing: -.045em;
  background-image: linear-gradient(96deg, #f2f6fb 0px, #7fd4ff 104px);
  background-size: 104px 100%;
  background-repeat: no-repeat;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.brand-tag {
  font-family: var(--mono);
  font-size: 8px;
  line-height: 1;
  letter-spacing: .2em;
  text-transform: uppercase;
  color: var(--ink-muted);
}

:global([data-theme='light'] .brand-name) {
  background-image: linear-gradient(96deg, #0a0f16 0px, #1560d4 104px);
}
:global([data-theme='light'] .brand-tag) { color: #6b7787; }
</style>
