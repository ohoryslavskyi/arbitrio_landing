import { onMounted, onBeforeUnmount, ref } from 'vue';

/**
 * Прогрес заповнення шкал партнерських рівнів: 0 -> 1.
 *
 * Запускається один раз, коли блок входить у вікно. Компонент множить свої
 * цільові відсотки на `progress`, тому DOM тут не чіпається — все через шаблон.
 *
 * @param {object}  [options]
 * @param {number}  [options.duration=2000]  тривалість, ms
 * @param {number}  [options.threshold=0.2]  яка частина блоку має бути видна
 * @returns {{ rootEl: import('vue').Ref<HTMLElement|null>, progress: import('vue').Ref<number> }}
 */
export function useLevelBars(options = {}) {
  const { duration = 2000, threshold = 0.2 } = options;

  const rootEl = ref(null);
  const progress = ref(0);

  let observer = null;
  let raf = 0;
  let started = false;

  const run = () => {
    if (started) return;
    started = true;

    const reduced = typeof matchMedia === 'function'
      && matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduced) {
      progress.value = 1;
      return;
    }

    const dur = Math.max(200, Number(duration) || 2000);
    const start = performance.now();

    const tick = (now) => {
      const t = Math.min(1, (now - start) / dur);
      progress.value = 1 - Math.pow(1 - t, 3); // ease-out cubic
      if (t < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
  };

  onMounted(() => {
    if (!rootEl.value || typeof IntersectionObserver === 'undefined') {
      run();
      return;
    }

    observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        observer = null;
        run();
      });
    }, { threshold });

    observer.observe(rootEl.value);
  });

  onBeforeUnmount(() => {
    if (observer) observer.disconnect();
    if (raf) cancelAnimationFrame(raf);
  });

  return { rootEl, progress };
}
