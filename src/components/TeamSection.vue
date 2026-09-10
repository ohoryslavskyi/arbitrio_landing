<template>
  <section id="team" class="team">
    <!-- декоративна сітка, зсунута до правого краю -->
    <div class="team-mesh" aria-hidden="true"></div>

    <div class="wrap team-wrap">
      <h2 class="section-title team-title">Команда</h2>

      <div class="team-cols">
        <div class="team-col">
          <p class="body-text">
            Ми — команда досвідчених IT-фахівців, які працювали на різних етапах SDLC: від аналізу
            вимог і проєктування до розробки, тестування, релізу та подальшого розвитку продукту.
          </p>
          <p class="body-text">
            У певний момент своєї карʼєри ми вирішили створити не просто продукт, а цілу
            криптоекосистему, відповідати за результати й працювати над тим, у що справді віримо!
          </p>
        </div>

        <p class="body-text team-col team-col--dim">
          У нашій команді зібралися спеціалісти різних напрямків: розробники, QA-інженери,
          бізнес-аналітики, менеджери, маркетологи та фахівці з розвитку продукту. За плечима
          команди — досвід роботи як із вузькоспеціалізованими рішеннями, так і з масштабними
          технологічними продуктами у складних доменах, зокрема FinTech, Crypto/Web3, AML, InsurTech.
        </p>
      </div>

      <!-- Фото надане власником. Замінюється файлом public/team-masks.png -->
      <figure class="team-media">
        <img class="team-photo" src="/team-masks.png" alt="Команда Arbitrio" />

        <div class="team-scan" aria-hidden="true"></div>
        <div class="team-fade" aria-hidden="true"></div>
        <div class="team-lines" aria-hidden="true"></div>

        <figcaption class="team-caption">
          <span class="team-kicker">Arbitr.IO / engineering unit</span>
          <p class="team-quote">
            Нас обʼєднує простий принцип: працювати не заради процесу, а заради результату.
          </p>
        </figcaption>
      </figure>
    </div>
  </section>
</template>

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
</style>
