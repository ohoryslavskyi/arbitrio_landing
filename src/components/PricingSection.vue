<template>
  <section id="pricing" class="pricing">
    <h2 class="section-title pricing-title">Прозорі тарифи</h2>

    <div class="pricing-row">
      <!-- Ліцензія — виділена картка -->
      <article class="card card--blue card--raise tariff">
        <span class="pill">Одноразово</span>
        <h3 class="tariff-name">Ліцензія Arbitr.IO</h3>
        <div class="price"><span class="price-sign price-sign--blue">$</span>150</div>
        <p class="tariff-text">
          Безстроковий доступ до функціоналу торгової системи відповідно до умов користування
          платформою.
        </p>
      </article>

      <article class="card card--raise tariff">
        <span class="pill pill--muted">Щомісяця</span>
        <h3 class="tariff-name">Оренда сервера</h3>
        <div class="price"><span class="price-sign">$</span>75</div>
        <p class="tariff-text">
          Стабільна та безперервна робота торгової системи на виділеній інфраструктурі.
        </p>
      </article>
    </div>

    <div class="pricing-row pricing-row--second">
      <div class="card card--raise terms">
        <span class="terms-kicker">Розрахунки</span>
        <div class="terms-figure">
          <span class="terms-num">7</span>
          <span class="terms-unit">календарних днів на оплату комісії</span>
        </div>
        <p class="tariff-text">
          За один день до запланованої дати платежу партнер отримує сповіщення. Несвоєчасна
          оплата без погодженої поважної причини призводить до автоматичного призупинення
          доступу та деактивації сервера.
        </p>
      </div>

      <!-- Штрафи — єдиний теплий акцент на сторінці -->
      <div class="card card--warm card--raise penalties">
        <h3 class="card-title">Штрафи</h3>

        <div class="penalties-row">
          <div v-for="item in penalties" :key="item.text" class="penalty">
            <strong class="penalty-value">{{ item.value }}</strong>
            <span class="penalty-text">{{ item.text }}</span>
          </div>
        </div>

        <p class="penalties-note">
          Порушення: сторонні боти на підключених біржових акаунтах, закриття лише однієї
          частини арбітражної позиції, втручання, що створює ризик незбалансованої позиції.
        </p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { penalties } from '../data/content';
</script>

<style scoped>
.pricing {
  max-width: var(--wrap);
  margin: 0 auto;
  padding: 56px var(--pad);
}

.pricing-title { margin-bottom: 26px; }

.pricing-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.pricing-row--second { margin-top: 12px; }

.tariff {
  flex: 1 1 400px;
  padding: 26px;
}

.tariff-name {
  margin: 20px 0 12px;
  font-size: 1.15rem;
  font-weight: 600;
  color: var(--ink);
}

.price {
  margin-bottom: 16px;
  font-family: var(--mono);
  font-size: 46px;
  font-weight: 700;
  line-height: 1;
  letter-spacing: -.03em;
  color: var(--ink);
}

.price-sign {
  font-size: 22px;
  vertical-align: super;
  color: var(--ink-muted);
}
.price-sign--blue { color: var(--blue); }

.tariff-text {
  font-size: 14px;
  line-height: 1.65;
  color: var(--ink-4);
}

.terms {
  flex: 1 1 400px;
  padding: 24px;
}

.terms-kicker {
  font-family: var(--mono);
  font-size: 10px;
  letter-spacing: .22em;
  text-transform: uppercase;
  color: var(--blue);
}

.terms-figure {
  display: flex;
  align-items: baseline;
  gap: 12px;
  margin: 18px 0 14px;
}

.terms-num {
  font-family: var(--mono);
  font-size: 46px;
  font-weight: 700;
  line-height: 1;
  letter-spacing: -.03em;
  color: var(--ink);
}

.terms-unit {
  font-size: 14px;
  color: var(--ink-5);
}

.penalties {
  flex: 1 1 400px;
  padding: 24px;
}

.card-title {
  font-size: 1.02rem;
  font-weight: 600;
  letter-spacing: -.015em;
  color: var(--ink);
}

.penalties-row {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 18px;
}

.penalty { flex: 1 1 150px; }

.penalty-value {
  display: block;
  font-family: var(--mono);
  font-size: 30px;
  font-weight: 700;
  line-height: 1;
  letter-spacing: -.02em;
  color: var(--ink);
}

.penalty-text {
  display: block;
  margin-top: 7px;
  font-size: 13px;
  line-height: 1.5;
  color: var(--ink-4);
}

.penalties-note {
  margin-top: 18px;
  font-size: 13px;
  line-height: 1.6;
  color: var(--warm-ink);
}
</style>
