<template>
  <section class="hero">
    <div class="hero-wrap">
      <div class="hero-col">
        <div class="badge">
          <span class="pulse-dot"></span>
          <span class="badge-text"> {{ t('m006') }} </span>
        </div>

        <h1 class="hero-title"> {{ t('m007') }} <span class="hero-title-accent"> {{ t('m008') }} </span>
        </h1>

        <p class="hero-claim"> {{ t('m009') }} </p>

        <p class="hero-lead"> {{ t('m010') }} </p>

        <div class="hero-actions">
          <a href="#cta" class="btn btn--primary"> {{ t('m003') }} </a>
          <a href="#demo" class="btn btn--ghost"> {{ t('m011') }} </a>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { t } from '../i18n/index.js';
</script>

<style scoped>
.hero { position: relative; }

.hero-wrap {
  position: relative;
  max-width: var(--wrap);
  margin: 0 auto;
  padding: 64px var(--pad) 40px;
}

.hero-col { max-width: 76ch; }

.badge {
  display: inline-flex;
  max-width: 100%;
  align-items: center;
  gap: 9px;
  padding: 6px 13px 6px 10px;
  border: 1px solid rgba(47, 140, 255, .28);
  border-radius: 999px;
  background: rgba(47, 140, 255, .05);
}

.badge .pulse-dot { flex: none; }

.badge-text {
  overflow-wrap: anywhere;
  font-family: var(--mono);
  font-size: 10px;
  letter-spacing: .22em;
  text-transform: uppercase;
  color: var(--blue-text);
}

.hero-title {
  margin-top: 26px;
  max-width: 19ch;
  font-size: clamp(2.6rem, 6vw, 4.6rem);
  line-height: 1.02;
  font-weight: 600;
  letter-spacing: -.035em;
  color: var(--ink);
}

/* другий рядок заголовка — градієнт по тексту */
.hero-title-accent {
  display: block;
  background-image: linear-gradient(90deg, #4fe3c0 0%, #3fb6e8 34%, #2f8cff 70%, #6aa8ff 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: var(--cyan); /* фолбек, якщо background-clip не підтримується */
}

.hero-claim {
  margin-top: 28px;
  max-width: 72ch;
  font-size: clamp(1.1rem, 1.7vw, 1.45rem);
  line-height: 1.45;
  font-weight: 600;
  letter-spacing: -.015em;
  background-image: linear-gradient(100deg, #7fd4ff 0%, #2f8cff 55%, #1560d4 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: var(--cyan);
}

.hero-lead {
  margin-top: 20px;
  max-width: 68ch;
  font-size: 1.06rem;
  line-height: 1.7;
  color: var(--ink-3);
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 34px;
}
@media (min-width: 1200px) {
  .hero-wrap { padding-top: 28px; }
  .badge { min-height: 28px; }
}
</style>
