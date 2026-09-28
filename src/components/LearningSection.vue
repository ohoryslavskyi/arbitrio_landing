<template>
  <section id="demo" class="learning">
    <h2 class="section-title learning-title"> {{ t('m012') }} </h2>

    <div class="learning-row">
      <div class="demo-panel">
        <span class="pill"> {{ t('m013') }} </span>

        <p class="demo-headline"> {{ t('m014') }} </p>

        <p class="demo-text"> {{ t('m015') }} </p>

        <p class="demo-note"> {{ t('m016') }} </p>
      </div>

      <ol class="steps">
        <li
          v-for="step in learningSteps"
          :key="step.n"
          class="step card card--lift"
          :class="{ 'step--accent': step.accent }"
        >
          <span class="step-n">{{ step.n }}</span>
          <div>
            <strong class="step-title">{{ t(step.title) }}</strong>
            <span class="step-text">{{ t(step.text) }}</span>
          </div>
        </li>
      </ol>
    </div>
  </section>
</template>

<script setup>
import { t } from '../i18n/index.js';

import { learningSteps } from '../data/content.js';
</script>

<style scoped>
.learning {
  max-width: var(--wrap);
  margin: 0 auto;
  padding: 56px var(--pad);
}

.learning-title { margin-bottom: 26px; }

.learning-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.demo-panel {
  flex: 1 1 460px;
  padding: 28px;
  border: 1px solid var(--blue-line);
  border-radius: 14px;
  background: linear-gradient(180deg, rgba(47, 140, 255, .08), rgba(47, 140, 255, .015));
}

.demo-headline {
  margin-top: 18px;
  font-size: clamp(1.05rem, 1.7vw, 1.32rem);
  line-height: 1.3;
  font-weight: 600;
  letter-spacing: -.02em;
  color: var(--ink);
}

.demo-text {
  margin-top: 16px;
  font-size: 15px;
  line-height: 1.7;
  color: var(--ink-2);
}

.demo-note {
  margin-top: 12px;
  font-size: 14px;
  line-height: 1.7;
  color: var(--ink-panel);
}

.steps {
  flex: 1 1 340px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.step {
  display: flex;
  gap: 14px;
  align-items: flex-start;
  padding: 16px 18px;
  border-radius: 11px;
}

/* останній крок — реальна торгівля — виділений рамкою */
.step--accent { border-color: rgba(47, 140, 255, .26); }

.step-n {
  flex: none;
  font-family: var(--mono);
  font-size: 11px;
  font-weight: 700;
  color: var(--blue);
}

.step-title {
  display: block;
  margin-bottom: 4px;
  font-size: 14.5px;
  font-weight: 600;
  color: var(--ink-2);
}

.step-text {
  font-size: 13.5px;
  line-height: 1.6;
  color: var(--ink-5);
}
</style>
