<template>
  <section id="cta" class="cta">
    <div class="cta-panel">
      <div class="cta-lines" aria-hidden="true"></div>

      <div class="cta-inner">
        <div class="cta-copy">
          <h2 class="cta-title"> {{ t('m001') }} </h2>
          <p class="cta-text"> {{ t('m002') }} </p>
        </div>

        <div class="cta-actions">
          <a href="#pricing" class="btn btn--primary btn--lg"> {{ t('m003') }} </a>
          <a href="#demo" class="btn btn--lg cta-secondary"> {{ t('m004') }} </a>
        </div>
      </div>
    </div>

    <aside class="legal">
      <span class="legal-badge">18+</span>
      <span class="legal-text"> {{ t('m005') }} </span>
    </aside>
  </section>
</template>

<script setup>
import { t } from '../i18n/index.js';
</script>

<style scoped>
.cta {
  max-width: var(--wrap);
  margin: 0 auto;
  padding: 34px var(--pad) 80px;
}

.cta-panel {
  position: relative;
  overflow: hidden;
  padding: 44px 40px;
  border: 1px solid var(--blue-line);
  border-radius: 16px;
  background: linear-gradient(140deg, rgba(47, 140, 255, .1), rgba(47, 140, 255, .02) 60%, transparent);
}

.cta-lines {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-image: repeating-linear-gradient(90deg, rgba(255, 255, 255, .03) 0 1px, transparent 1px 40px);
}

.cta-inner {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  gap: 28px;
  align-items: center;
  justify-content: space-between;
}

.cta-copy { flex: 1 1 460px; }

.cta-title {
  margin-bottom: 12px;
  max-width: 24ch;
  font-size: clamp(1.6rem, 2.8vw, 2.2rem);
  font-weight: 600;
  letter-spacing: -.03em;
  color: var(--ink);
}

.cta-text {
  max-width: 56ch;
  font-size: 15px;
  line-height: 1.7;
  color: var(--ink-3);
}

.cta-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.btn--lg { padding: 15px 26px; }

.cta-secondary {
  background: rgba(5, 7, 12, .5);
  border: 1px solid rgba(255, 255, 255, .14);
  color: #e6ecf2;
  font-weight: 500;
}
.cta-secondary:hover { border-color: rgba(47, 140, 255, .5); color: var(--ink); }

.legal {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: center;
  margin-top: 12px;
  padding: 20px 22px;
  background: var(--surface);
  border: 1px solid var(--hairline);
  border-radius: 12px;
}

.legal-badge {
  flex: none;
  padding: 7px 10px;
  border-radius: 7px;
  background: var(--blue);
  font-family: var(--mono);
  font-size: 15px;
  font-weight: 700;
  color: var(--on-blue);
}

.legal-text {
  flex: 1 1 420px;
  font-size: 14px;
  line-height: 1.6;
  color: var(--ink-4);
}
</style>
