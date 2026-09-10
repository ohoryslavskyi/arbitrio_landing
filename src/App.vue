<template>
  <div class="page">
    <!-- Інтерактивна сітка квадратів за hero. aria-hidden — це декор. -->
    <div ref="gridEl" class="cell-grid" aria-hidden="true">
      <span v-for="i in cellCount" :key="i" class="cell"></span>
    </div>

    <!-- Синє світло над hero -->
    <div class="hero-glow" aria-hidden="true"></div>

    <main id="top" class="main">
      <HeroSection />
      <TeamSection />
      <StatsBar />
      <MissionSection />
      <PlatformSection />
      <LearningSection />
      <PartnerSection />
      <PricingSection />
      <CtaSection />
      <SiteFooter />
    </main>
  </div>
</template>

<script setup>
import HeroSection from './components/HeroSection.vue';
import TeamSection from './components/TeamSection.vue';
import StatsBar from './components/StatsBar.vue';
import MissionSection from './components/MissionSection.vue';
import PlatformSection from './components/PlatformSection.vue';
import LearningSection from './components/LearningSection.vue';
import PartnerSection from './components/PartnerSection.vue';
import PricingSection from './components/PricingSection.vue';
import CtaSection from './components/CtaSection.vue';
import SiteFooter from './components/SiteFooter.vue';
import { usePointerGrid } from './composables/usePointerGrid.js';

const { gridEl, cellCount } = usePointerGrid();
</script>

<style scoped>
.page {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  background: var(--bg);
}

.main { position: relative; }

.cell-grid {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 520px;
  pointer-events: none;
  overflow: hidden;
  display: grid;
  grid-template-columns: repeat(auto-fill, 62px);
  grid-auto-rows: 62px;
  gap: 2px;
  mask-image: radial-gradient(120% 76% at 50% 0%, #000 0%, transparent 82%);
  -webkit-mask-image: radial-gradient(120% 76% at 50% 0%, #000 0%, transparent 82%);
}

.hero-glow {
  position: absolute;
  top: -320px;
  left: 50%;
  width: 1300px;
  height: 700px;
  transform: translateX(-50%);
  pointer-events: none;
  background: radial-gradient(closest-side, rgba(47, 140, 255, .13), transparent 72%);
}
</style>
