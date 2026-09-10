<template>
  <section id="levels" class="partner">
    <header class="partner-head">
      <h2 class="section-title">Партнерська програма</h2>
      <p class="section-lead">
        Шість рівнів, до 90% від PnL <span class="flame" aria-hidden="true">🔥</span>
      </p>
    </header>

    <div class="claim">
      <p class="claim-lead">Такої частки від PnL не пропонує жоден інший сервіс на ринку.</p>
      <p class="claim-note">
        Досягнутий рівень зберігається навіть у разі тимчасової неактивності партнера.
      </p>
    </div>

    <!-- Шкали заповнюються один раз, коли блок входить у вікно -->
    <div ref="rootEl" class="levels">
      <article
        v-for="level in partnerLevels"
        :key="level.n"
        class="level"
        :class="{ 'level--top': level.top }"
      >
        <div class="level-id">
          <span class="level-kicker">Рівень</span>
          <b class="level-n">{{ level.n }}</b>
        </div>

        <div class="level-track">
          <i class="level-fill" :style="{ width: (level.share * progress).toFixed(2) + '%' }"></i>
        </div>

        <div class="level-req">{{ level.requirement }}</div>

        <div class="level-share">
          <b class="level-pct">{{ Math.round(level.share * progress) }}%</b>
          <span class="level-unit">від PnL</span>
        </div>
      </article>
    </div>

    <div class="partner-cards">
      <div class="card card--glow rewards">
        <h3 class="card-title">Винагорода за підключення</h3>

        <div class="rewards-list">
          <div
            v-for="row in connectionRewards"
            :key="row.level"
            class="reward row-hover"
            :class="{ 'reward--top': row.top }"
          >
            <span class="reward-level">{{ row.level }}</span>
            <b class="reward-amount">{{ row.amount }}</b>
          </div>
        </div>
      </div>

      <div class="partner-side">
        <div class="card card--glow benefits">
          <h3 class="card-title">Що отримує партнер</h3>
          <div class="benefits-list">
            <span
              v-for="item in partnerBenefits"
              :key="item"
              class="benefit chip-hover"
            >{{ item }}</span>
          </div>
        </div>

        <p class="partner-footnote">
          Різниця у винагороді розподіляється між вищими рівнями структури згідно з правилами
          програми.
        </p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { partnerLevels, connectionRewards, partnerBenefits } from '../data/content.js';
import { useLevelBars } from '../composables/useLevelBars.js';

const { rootEl, progress } = useLevelBars();
</script>

<style scoped>
.partner {
  max-width: var(--wrap);
  margin: 0 auto;
  padding: 56px var(--pad);
}

.partner-head {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 26px;
}

/* акцент на унікальності частки */
.claim {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 18px 26px;
  margin-bottom: 16px;
  padding: 24px 28px;
  border: 1px solid rgba(47, 140, 255, .34);
  border-left: 3px solid var(--blue);
  border-radius: 14px;
  background: linear-gradient(100deg, rgba(47, 140, 255, .13), rgba(47, 140, 255, .02) 70%);
}

.claim-lead {
  flex: 1 1 460px;
  font-size: clamp(1.05rem, 1.8vw, 1.42rem);
  line-height: 1.35;
  font-weight: 600;
  letter-spacing: -.025em;
  color: var(--ink);
}

.claim-note {
  flex: 1 1 320px;
  font-size: 14.5px;
  line-height: 1.7;
  color: var(--ink-3);
}

/* --- таблиця рівнів --- */

.levels {
  display: grid;
  gap: 8px;
}

.level {
  display: grid;
  grid-template-columns: minmax(72px, 84px) minmax(110px, 1fr) minmax(170px, 1.1fr) minmax(92px, 104px);
  gap: 18px;
  align-items: center;
  padding: 16px 20px;
  background: var(--surface);
  border: 1px solid var(--hairline);
  border-radius: 11px;
}

.level--top {
  background: linear-gradient(90deg, rgba(47, 140, 255, .07), rgba(47, 140, 255, .02));
  border-color: rgba(47, 140, 255, .34);
}

.level-id {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.level-kicker {
  font-family: var(--mono);
  font-size: 9px;
  letter-spacing: .18em;
  text-transform: uppercase;
  color: var(--ink-muted);
}
.level--top .level-kicker { color: var(--ink-caption); }

.level-n {
  font-family: var(--mono);
  font-size: 19px;
  font-weight: 600;
  color: #e6ecf2;
}
.level--top .level-n { color: var(--blue-text); }

.level-track {
  height: 6px;
  border-radius: 99px;
  background: rgba(255, 255, 255, .06);
  overflow: hidden;
}

.level-fill {
  display: block;
  height: 100%;
  border-radius: 99px;
  background: linear-gradient(90deg, #1b4f9e, var(--blue));
}
.level--top .level-fill { background: linear-gradient(90deg, var(--blue), #9fc8ff); }

.level-req {
  font-size: 14px;
  line-height: 1.5;
  color: var(--ink-3);
}
.level--top .level-req { color: var(--ink-2); }

.level-share { text-align: right; }

.level-pct {
  display: block;
  font-family: var(--mono);
  font-size: 22px;
  font-weight: 700;
  letter-spacing: -.02em;
  color: var(--ink);
  font-variant-numeric: tabular-nums;
}
.level--top .level-pct { color: var(--blue-hi); }

.level-unit {
  font-family: var(--mono);
  font-size: 9px;
  letter-spacing: .16em;
  text-transform: uppercase;
  color: var(--ink-muted);
}
.level--top .level-unit { color: var(--ink-caption); }

/* --- дві картки під таблицею --- */

.partner-cards {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 12px;
}

.rewards { flex: 1 1 420px; padding: 24px; }

.partner-side {
  flex: 1 1 320px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.benefits { flex: 1; padding: 24px; }

.card-title {
  font-size: 1.02rem;
  font-weight: 600;
  letter-spacing: -.015em;
  color: var(--ink);
}

.rewards-list {
  display: grid;
  gap: 1px;
  margin-top: 16px;
  background: var(--divider);
  border: 1px solid var(--divider);
  border-radius: 10px;
  overflow: hidden;
}

.reward {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 11px 15px;
  background: var(--surface-inset);
}
.reward:hover {
  background: var(--row-hover);
  padding-left: 19px;
}

.reward--top { background: rgba(47, 140, 255, .06); }
.reward--top:hover { background: rgba(47, 140, 255, .15); }

.reward-level {
  font-size: 13.5px;
  white-space: nowrap;
  color: var(--ink-3);
}
.reward--top .reward-level { color: var(--ink-2); }

.reward-amount {
  font-family: var(--mono);
  font-size: 15px;
  white-space: nowrap;
  color: var(--ink);
}
.reward--top .reward-amount {
  font-weight: 700;
  color: var(--blue-hi);
}

.benefits-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 16px;
}

.benefit {
  font-size: 14px;
  line-height: 1.55;
  color: var(--ink-2);
}

@media (max-width: 720px) {
  .level {
    grid-template-columns: 84px 1fr;
    grid-template-areas:
      'id share'
      'track track'
      'req req';
    gap: 12px 18px;
  }
  .level-id { grid-area: id; }
  .level-track { grid-area: track; }
  .level-req { grid-area: req; }
  .level-share { grid-area: share; }
}

.partner-footnote {
  padding: 18px 20px;
  border: 1px solid rgba(47, 140, 255, .24);
  border-radius: 12px;
  background: rgba(47, 140, 255, .05);
  font-size: 13.5px;
  line-height: 1.6;
  color: var(--ink-panel);
}
</style>
