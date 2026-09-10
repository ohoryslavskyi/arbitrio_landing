<template>
  <section id="mission" class="mission">
    <div class="mission-glow" aria-hidden="true"></div>
    <div class="mission-lines" aria-hidden="true"></div>

    <div class="wrap mission-wrap">
      <h2 class="section-title mission-title">Наша місія</h2>

      <p class="body-text mission-p">
        Ми хочемо дати людям те, чого нам самим не вистачало на ринку.
      </p>

      <p class="body-text mission-p mission-p--last">
        Наш продукт створюється не лише для професійних трейдерів або технічних спеціалістів.
        Ми будуємо систему, у якій різні люди можуть знайти для себе свою роль.
      </p>

      <div class="mission-grid">
        <article
          v-for="item in missionScenarios"
          :key="item.label"
          class="scenario card card--lift"
        >
          <span class="scenario-mark" aria-hidden="true">?</span>
          <span class="eyebrow scenario-label">{{ item.label }}</span>
          <p class="scenario-text">{{ item.text }}</p>
        </article>
      </div>

      <div class="verdict">
        <p class="verdict-lead">
          Якщо хоча б на одне з цих питань ви відповіли ствердно — цей продукт вам неодмінно
          підійде! ✅ Адже він орієнтований не на прогнозування напрямку ринку, а на пошук
          і використання конкретних ринкових ситуацій.
        </p>

        <p class="verdict-text">
          Якщо хоча б один із цих сценаріїв вам близький — запрошуємо спробувати наш
          <a href="#demo" class="verdict-link">Demo Mode</a>. Ви зможете розібратися в логіці
          роботи платформи, побачити її інструменти в дії та самостійно оцінити продукт без
          необхідності одразу приймати будь-які рішення.
        </p>

        <div class="verdict-foot">
          <p class="verdict-note">
            Ми не хочемо бути багатослівними — краще покажемо наш софт у роботі. 🚀
          </p>
          <a href="#cta" class="btn btn--primary verdict-cta">Отримати доступ</a>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { missionScenarios } from '../data/content.js';
</script>

<style scoped>
.mission {
  position: relative;
  overflow: hidden;
  margin-top: 56px;
  border-top: 1px solid var(--divider);
  border-bottom: 1px solid var(--divider);
  background: var(--bg-alt);
}

.mission-glow {
  position: absolute;
  top: -260px;
  left: 50%;
  width: 1200px;
  height: 620px;
  transform: translateX(-50%);
  pointer-events: none;
  background: radial-gradient(closest-side, rgba(47, 140, 255, .14), transparent 72%);
}

.mission-lines {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-image: repeating-linear-gradient(90deg, rgba(255, 255, 255, .022) 0 1px, transparent 1px 80px);
}

.mission-wrap {
  position: relative;
  padding: 60px var(--pad) 66px;
}

.mission-title {
  margin-bottom: 22px;
  line-height: 1.14;
}

.mission-p { max-width: 70ch; margin-bottom: 16px; }
.mission-p--last { margin-bottom: 30px; }

.mission-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.scenario {
  flex: 1 1 300px;
  position: relative;
  overflow: hidden;
  padding: 24px;
}

/* великий декоративний знак питання */
.scenario-mark {
  position: absolute;
  top: 8px;
  right: 16px;
  pointer-events: none;
  font-family: var(--mono);
  font-size: 64px;
  font-weight: 700;
  line-height: 1;
  color: rgba(47, 140, 255, .09);
}

.scenario-label { position: relative; }

.scenario-text {
  position: relative;
  margin-top: 18px;
  font-size: 15px;
  line-height: 1.65;
  color: var(--ink-2);
}

.verdict {
  margin-top: 12px;
  padding: 30px 32px;
  border: 1px solid var(--blue-line);
  border-radius: 14px;
  background: linear-gradient(140deg, rgba(47, 140, 255, .1), rgba(47, 140, 255, .02) 62%, transparent);
}

.verdict-lead {
  max-width: 64ch;
  font-size: clamp(1.05rem, 1.7vw, 1.3rem);
  line-height: 1.5;
  font-weight: 600;
  letter-spacing: -.02em;
  color: var(--ink);
}

.verdict-text {
  margin-top: 18px;
  max-width: 72ch;
  font-size: 14.5px;
  line-height: 1.75;
  color: var(--ink-panel);
}

.verdict-link {
  color: var(--blue-hi);
  border-bottom: 1px solid rgba(106, 168, 255, .4);
}
.verdict-link:hover { color: #a8c9ff; border-bottom-color: #a8c9ff; }

.verdict-foot {
  display: flex;
  flex-wrap: wrap;
  gap: 18px 24px;
  align-items: center;
  margin-top: 26px;
  padding-top: 24px;
  border-top: 1px solid rgba(47, 140, 255, .16);
}

.verdict-note {
  flex: 1 1 340px;
  font-size: 15px;
  line-height: 1.6;
  color: var(--ink-2);
}

.verdict-cta { flex: none; }
</style>
