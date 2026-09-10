<template>
  <section id="platform" class="platform">
    <h2 class="section-title platform-title">Побудована на висновках, а не на обіцянках</h2>

    <div class="platform-cols">
      <p class="body-text platform-col">
        Ми пройшли довгий шлях досліджень: ризик-менеджмент арбітражних стратегій, аналіз
        вразливостей і повторюваних збоїв у конкурентних рішеннях, розбір реальних інцидентів
        на ринку. Кожен знайдений сценарій відмови ми врахували в архітектурі — у результаті
        система працює надійніше там, де інші ламаються.
      </p>
      <p class="body-text platform-col">
        Захист коштів, стійкість до кібератак, продуктивність під навантаженням і стабільність
        виконання — це не окремі функції, а вимоги, під які проєктувався кожен модуль. Реліз
        проходить лише після повного циклу автоматизованих перевірок.
      </p>
    </div>

    <div class="platform-grid">
      <article
        v-for="card in platformCards"
        :key="card.title"
        class="pcard card card--lift"
      >
        <span class="eyebrow">{{ card.eyebrow }}</span>
        <h3 class="pcard-title">{{ card.title }}</h3>
        <p class="pcard-text">{{ card.text }}</p>
      </article>
    </div>
  </section>
</template>

<script setup>
import { platformCards } from '../data/content.js';
</script>

<style scoped>
.platform {
  max-width: var(--wrap);
  margin: 0 auto;
  padding: 56px var(--pad) 34px;
}

.platform-title {
  max-width: 24ch;
  margin-bottom: 26px;
}

.platform-cols {
  display: flex;
  flex-wrap: wrap;
  gap: 24px 44px;
  margin-bottom: 26px;
}

.platform-col {
  flex: 1 1 420px;
  color: var(--ink-4);
}

.platform-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.pcard {
  flex: 1 1 330px;
  padding: 22px;
}

.pcard-title {
  margin: 16px 0 10px;
  font-size: 1.1rem;
  font-weight: 600;
  letter-spacing: -.015em;
  color: var(--ink);
}

.pcard-text {
  font-size: 14px;
  line-height: 1.65;
  color: var(--ink-4);
}
</style>
