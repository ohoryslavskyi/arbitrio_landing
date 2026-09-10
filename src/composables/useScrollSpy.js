import { onBeforeUnmount, onMounted, ref } from 'vue';

/**
 * Стан правої навігації: чи її видно і яка секція зараз на екрані.
 *
 * Вимірювання йде в requestAnimationFrame, тому на кожну подію scroll
 * припадає максимум один прохід по DOM.
 *
 * @param {string[]} ids id секцій згори вниз
 * @param {{ showAfter?: number }} [options] showAfter — скільки px треба
 *   прокрутити, щоб навігація зʼявилась (за замовчуванням висота hero)
 * @returns {{ visible: import('vue').Ref<boolean>, activeId: import('vue').Ref<string> }}
 */
export function useScrollSpy(ids, { showAfter = 520 } = {}) {
  const visible = ref(false);
  const activeId = ref(ids[0] ?? '');

  let frame = 0;

  const measure = () => {
    frame = 0;

    const y = window.scrollY || 0;
    visible.value = y > showAfter;

    // Активна та секція, чий верх останнім перетнув третину екрана згори.
    const line = y + window.innerHeight * 0.34;
    let current = ids[0] ?? '';

    for (const id of ids) {
      const el = document.getElementById(id);
      if (!el) continue;
      const top = el.getBoundingClientRect().top + y;
      if (top <= line) current = id;
    }

    // У самому низу сторінки остання секція може не дотягнутись до лінії.
    const bottom = document.documentElement.scrollHeight - window.innerHeight - 4;
    if (y >= bottom) current = ids[ids.length - 1] ?? current;

    activeId.value = current;
  };

  const schedule = () => {
    if (!frame) frame = requestAnimationFrame(measure);
  };

  onMounted(() => {
    measure();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });
  });

  onBeforeUnmount(() => {
    if (frame) cancelAnimationFrame(frame);
    window.removeEventListener('scroll', schedule);
    window.removeEventListener('resize', schedule);
  });

  return { visible, activeId };
}
