<template>
  <section class="stats">
    <div class="stats-row">
      <div
        v-for="stat in stats"
        :key="stat.caption"
        class="stat card card--lift"
        :class="{ 'stat--accent': stat.accent }"
      >
        <span class="stat-num">
          <!-- «до» тісніше до числа: інакше візуально читається як подвійний пробіл -->
          <span v-if="stat.value.startsWith('до ')" class="stat-prefix"> {{ t('m050') }} </span>
          <span v-if="stat.value.startsWith('до ')">&nbsp;{{ stat.value.slice(3) }}</span>
          <span v-else>{{ stat.value }}</span>
          <span v-if="stat.flame" class="flame" aria-hidden="true">🔥</span>
        </span>

        <span class="stat-sheen" aria-hidden="true"></span>

        <span class="stat-caption">{{ t(stat.caption) }}</span>
      </div>
    </div>
  </section>
</template>

<script setup>
import { t } from '../i18n/index.js';

import { stats } from '../data/content.js';
</script>

<style scoped>
.stats {
  max-width: var(--wrap);
  margin: 0 auto;
  padding: 34px var(--pad) 0;
}

.stats-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.stat {
  flex: 1 1 220px;
  position: relative;
  overflow: hidden;
  padding: 20px;
  cursor: default;
}

/* картка «до 90%» виділена завжди, не лише при наводі */
.stat--accent {
  background: linear-gradient(180deg, rgba(47, 140, 255, .1), rgba(47, 140, 255, .02));
  border-color: rgba(47, 140, 255, .36);
}
.stat--accent:hover {
  background: linear-gradient(180deg, rgba(47, 140, 255, .1), rgba(47, 140, 255, .02));
  border-color: rgba(47, 140, 255, .62);
}
.stat--accent .stat-num { color: var(--blue-text); }

.stat-num {
  display: block;
  font-family: var(--mono);
  font-size: 30px;
  font-weight: 700;
  line-height: 1;
  letter-spacing: -.03em;
  color: var(--ink);
  transition: color .3s, letter-spacing .3s;
}

.stat-prefix { letter-spacing: -.09em; }

.stat:hover .stat-num {
  color: var(--blue-text);
  letter-spacing: -.02em;
}

/* блиск пробігає по картці при наводі */
.stat-sheen {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 45%;
  pointer-events: none;
  transform: translateX(-120%);
  background: linear-gradient(100deg, transparent, rgba(143, 188, 255, .14), transparent);
}
.stat:hover .stat-sheen { animation: sheen 1.1s ease-out; }

.stat-caption {
  display: block;
  margin-top: 8px;
  font-size: 13.5px;
  color: var(--ink-5);
}
</style>
