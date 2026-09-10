<template>
  <footer class="footer">
    <div class="footer-inner">
      <a href="#top" class="footer-brand" aria-label="Arbitrio — на початок сторінки">
        <BrandLockup />
      </a>

      <nav class="footer-nav">
        <a v-for="link in footerLinks" :key="link.href" :href="link.href" class="footer-link">
          {{ link.label }}
        </a>
      </nav>
    </div>
  </footer>
</template>

<script setup>
import BrandLockup from './BrandLockup.vue';
import { footerLinks } from '../data/content.js';
</script>

<style scoped>
.footer { border-top: 1px solid var(--divider); }

.footer-inner {
  max-width: var(--wrap);
  margin: 0 auto;
  padding: 26px var(--pad);
  display: flex;
  flex-wrap: wrap;
  gap: 18px 24px;
  align-items: center;
  justify-content: space-between;
}

.footer-brand { flex: none; }

.footer-nav {
  display: flex;
  flex-wrap: wrap;
  gap: 18px;
}

.footer-link {
  font-size: 13px;
  color: var(--ink-muted);
  transition: color .18s;
}
.footer-link:hover { color: var(--ink-3); }
</style>
