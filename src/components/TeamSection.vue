<template>
  <section id="team" class="team">
    <!-- декоративна сітка, зсунута до правого краю -->
    <div class="team-mesh" aria-hidden="true"></div>

    <div class="wrap team-wrap">
      <h2 class="section-title team-title"> {{ t('m051') }} </h2>

      <div class="team-cols">
        <div class="team-col">
          <p class="body-text"> {{ t('m052') }} </p>
          <p class="body-text"> {{ t('m053') }} </p>
        </div>

        <p class="body-text team-col team-col--dim"> {{ t('m054') }} </p>
      </div>

      <!-- Фото надане власником. Замінюється файлом public/team-masks.png -->
      <figure class="team-media">
        <div class="team-image-viewport" @touchstart="startTouch" @touchmove="moveTouch" @touchend="endTouch" @touchcancel="endTouch">
          <img class="team-photo" src="/team-masks.png" :alt="t('m055')" :style="{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }" draggable="false" />
        </div>
        <button v-if="zoom > 1" class="team-reset" type="button" @click="resetZoom"> {{ t('m056') }} </button>

        <div class="team-scan" aria-hidden="true"></div>
        <div class="team-fade" aria-hidden="true"></div>
        <div class="team-lines" aria-hidden="true"></div>

        <figcaption class="team-caption">
          <span class="team-kicker">Arbitr.IO / engineering unit</span>
          <p class="team-quote"> {{ t('m057') }} </p>
        </figcaption>
      </figure>
    </div>
  </section>
</template>

<script setup>
import { t } from '../i18n/index.js';

import { ref } from 'vue';
const zoom = ref(1);
const pan = ref({ x: 0, y: 0 });
let gesture = null;
const distance = touches => Math.hypot(touches[0].clientX - touches[1].clientX, touches[0].clientY - touches[1].clientY);
function startTouch(event) {
  if (event.touches.length === 2) {
    gesture = { distance: distance(event.touches), zoom: zoom.value };
  } else if (zoom.value > 1) {
    gesture = { x: event.touches[0].clientX, y: event.touches[0].clientY, pan: { ...pan.value } };
  }
}
function moveTouch(event) {
  if (!gesture) return;
  if (event.touches.length === 2 && gesture.distance) {
    event.preventDefault();
    zoom.value = Math.min(4, Math.max(1, gesture.zoom * distance(event.touches) / gesture.distance));
  } else if (event.touches.length === 1 && gesture.pan && zoom.value > 1) {
    event.preventDefault();
    pan.value = { x: gesture.pan.x + event.touches[0].clientX - gesture.x, y: gesture.pan.y + event.touches[0].clientY - gesture.y };
  }
  const rect = event.currentTarget.getBoundingClientRect();
  const maxX = rect.width * (zoom.value - 1) / 2;
  const maxY = rect.height * (zoom.value - 1) / 2;
  pan.value = { x: Math.max(-maxX, Math.min(maxX, pan.value.x)), y: Math.max(-maxY, Math.min(maxY, pan.value.y)) };
}
function endTouch(event) {
  gesture = null;
  if (event.touches.length) startTouch(event);
}
function resetZoom() { zoom.value = 1; pan.value = { x: 0, y: 0 }; }
</script>

<style scoped>
.team {
  position: relative;
  overflow: hidden;
  border-top: 1px solid var(--divider);
  border-bottom: 1px solid var(--divider);
  background: var(--bg-alt);
}

.team-mesh {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-image:
    repeating-linear-gradient(90deg, rgba(47, 140, 255, .055) 0 1px, transparent 1px 34px),
    repeating-linear-gradient(0deg, rgba(47, 140, 255, .045) 0 1px, transparent 1px 34px);
  mask-image: radial-gradient(80% 70% at 78% 40%, #000, transparent 75%);
  -webkit-mask-image: radial-gradient(80% 70% at 78% 40%, #000, transparent 75%);
}

.team-wrap { position: relative; }

.team-title { margin-bottom: 26px; }

.team-cols {
  display: flex;
  flex-wrap: wrap;
  gap: 24px 44px;
  margin-bottom: 26px;
}

.team-col {
  flex: 1 1 420px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.team-col--dim { color: var(--ink-4); }

.team-media {
  position: relative;
  margin: 0;
  height: clamp(360px, 44vw, 520px);
  border-radius: 16px;
  overflow: hidden;
  background: var(--surface-dark);
  border: 1px solid rgba(255, 255, 255, .08);
}

.team-image-viewport { height: 100%; overflow: hidden; }
.team-reset { position: absolute; top: 10px; right: 10px; z-index: 2; padding: 10px; border-radius: 8px; border: 1px solid var(--blue-line); background: var(--bg); color: var(--ink); cursor: pointer; }

.team-photo {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* горизонтальні скан-лінії */
.team-scan {
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: .45;
  background-image: repeating-linear-gradient(0deg, rgba(255, 255, 255, .035) 0 1px, transparent 1px 4px);
}

/* затемнення донизу, щоб підпис читався */
.team-fade {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: linear-gradient(180deg, rgba(5, 7, 12, .5) 0%, rgba(5, 7, 12, .28) 44%, rgba(5, 7, 12, .95) 100%);
}

/* вертикальні сині лінії, що проявляються знизу */
.team-lines {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-image: repeating-linear-gradient(90deg, rgba(47, 140, 255, .07) 0 1px, transparent 1px 40px);
  mask-image: linear-gradient(180deg, transparent, #000);
  -webkit-mask-image: linear-gradient(180deg, transparent, #000);
}

.team-caption {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  padding: 28px 30px;
}

.team-kicker {
  display: block;
  margin-bottom: 10px;
  font-family: var(--mono);
  font-size: 10px;
  letter-spacing: .24em;
  text-transform: uppercase;
  color: var(--ink-caption);
}

.team-quote {
  max-width: 44ch;
  font-size: clamp(1.05rem, 1.9vw, 1.5rem);
  line-height: 1.35;
  font-weight: 600;
  letter-spacing: -.02em;
  color: var(--ink);
}
@media (max-width: 720px) {
  .team-media { height: auto; }
  .team-image-viewport { height: auto; }
  .team-photo { height: auto; object-fit: contain; }
  .team-caption { position: relative; padding: 20px; }
  .team-fade { display: none; }
  .team-kicker { letter-spacing: .12em; }
}
</style>
