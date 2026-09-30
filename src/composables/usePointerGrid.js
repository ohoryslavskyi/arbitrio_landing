import { onMounted, onBeforeUnmount, nextTick, ref, watch } from 'vue';

const IDLE_BG = 'rgba(47,140,255,.05)';
const IDLE_SHADOW = 'inset 0 0 0 1px rgba(143,188,255,.09)';

/**
 * Сітка квадратів, що реагує на курсор.
 *
 * Квадрат у радіусі RADIUS від мишки збільшується, світлішає, отримує світіння
 * і трохи тягнеться до курсора. Сила ефекту падає квадратично з відстанню,
 * тому пляма має мʼякий край.
 *
 * Кількість квадратів рахується з реального розміру контейнера, тому сітка
 * заповнює його на будь-якій ширині екрана і перераховується на resize.
 *
 * Стилі пишуться напряму в element.style, а не через reactive-стан: 260+ вузлів
 * на кожен рух мишки — це саме той випадок, коли реактивність зайва.
 *
 * @param {object}  [options]
 * @param {number}  [options.radius=150]     радіус впливу, px
 * @param {number}  [options.cellSize=62]    сторона квадрата, px
 * @param {number}  [options.gap=2]          проміжок між квадратами, px
 * @param {number}  [options.initialCount=260] скільки відрендерити до першого виміру
 * @returns {{ gridEl: import('vue').Ref<HTMLElement|null>, cellCount: import('vue').Ref<number> }}
 */
export function usePointerGrid(options = {}) {
  const {
    radius = 150,
    cellSize = 62,
    gap = 2,
    initialCount = 260,
  } = options;

  /** @type {import('vue').Ref<HTMLElement|null>} */
  const gridEl = ref(null);
  const cellCount = ref(initialCount);

  const step = cellSize + gap;

  let nodes = [];
  let centers = [];
  let box = null;

  let measureRaf = 0;
  let paintRaf = 0;
  let painting = false;

  let mx = -9999;
  let my = -9999;

  let reduced = false;

  /** Скинути квадрат у стан спокою — один раз, а не щокадру. */
  const idle = (node) => {
    node.dataset.on = '0';
    node.style.transform = '';
    node.style.background = IDLE_BG;
    node.style.boxShadow = IDLE_SHADOW;
  };

  /** Перечитати геометрію і, за потреби, змінити кількість квадратів. */
  const measure = () => {
    const grid = gridEl.value;
    if (!grid) return;

    nodes = Array.from(grid.querySelectorAll('.cell'));
    box = grid.getBoundingClientRect();

    centers = nodes.map((node) => {
      const r = node.getBoundingClientRect();
      return { cx: r.left + r.width / 2, cy: r.top + r.height / 2 };
    });

    const needed = Math.ceil((box.width + gap) / step) * Math.ceil((box.height + gap) / step);
    if (needed !== cellCount.value) cellCount.value = needed;
  };

  /** Один кадр підсвітки. */
  const paint = () => {
    painting = false;

    for (let i = 0; i < nodes.length; i += 1) {
      const c = centers[i];
      if (!c) continue;

      const node = nodes[i];
      const dx = c.cx - mx;
      const dy = c.cy - my;
      const d = Math.sqrt(dx * dx + dy * dy);

      if (d > radius) {
        if (node.dataset.on === '1') idle(node);
        continue;
      }

      const t = 1 - d / radius;
      const e = t * t;

      node.dataset.on = '1';
      node.style.transform =
        `scale(${(1 + (reduced ? 0 : 0.26) * e).toFixed(3)}) translate(${(-dx * 0.07 * e).toFixed(2)}px,${(-dy * 0.07 * e).toFixed(2)}px)`;
      node.style.background = `rgba(47,140,255,${(0.05 + 0.3 * e).toFixed(3)})`;
      node.style.boxShadow =
        `inset 0 0 0 1px rgba(143,188,255,${(0.09 + 0.42 * e).toFixed(3)}), 0 0 ${(16 * e).toFixed(1)}px rgba(47,140,255,${(0.4 * e).toFixed(3)})`;
    }
  };

  const onMove = (event) => {
    if (event.type === 'pointerdown') measure();
    mx = event.clientX;
    my = event.clientY;

    // курсор далеко по вертикалі — гасимо сітку, не рахуючи кожен квадрат
    if (box && (my < box.top - radius || my > box.bottom + radius)) {
      mx = -9999;
      my = -9999;
    }

    if (!painting) {
      painting = true;
      paintRaf = requestAnimationFrame(paint);
    }
  };

  const onResize = () => {
    if (measureRaf) cancelAnimationFrame(measureRaf);
    measureRaf = requestAnimationFrame(measure);
  };

  // кількість змінилась -> дочекатись рендера і перечитати центри
  watch(cellCount, () => nextTick(measure));

  onMounted(() => {
    reduced = typeof matchMedia === 'function'
      && matchMedia('(prefers-reduced-motion: reduce)').matches;

    measure();
    // друга спроба після того, як шрифти й лейаут стали на місце
    requestAnimationFrame(measure);

    window.addEventListener('resize', onResize);
    window.addEventListener('scroll', onResize, { passive: true });
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onMove, { passive: true });
  });

  onBeforeUnmount(() => {
    window.removeEventListener('resize', onResize);
    window.removeEventListener('scroll', onResize);
    window.removeEventListener('pointermove', onMove);
    window.removeEventListener('pointerdown', onMove);
    if (measureRaf) cancelAnimationFrame(measureRaf);
    if (paintRaf) cancelAnimationFrame(paintRaf);
  });

  return { gridEl, cellCount };
}
