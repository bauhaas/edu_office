import type { MaybeRefOrGetter } from 'vue'

const SWIPE_THRESHOLD_PX = 40

/** Index state + horizontal swipe for a looping card carousel. */
export function useCarousel(target: MaybeRefOrGetter<HTMLElement | null | undefined>, count: () => number) {
  const index = ref(0)

  const go = (next: number): void => {
    const total = count()
    if (total === 0) return
    index.value = ((next % total) + total) % total
  }
  const next = (): void => go(index.value + 1)
  const previous = (): void => go(index.value - 1)

  const { distanceX, isSwiping } = usePointerSwipe(target, {
    threshold: SWIPE_THRESHOLD_PX,
    onSwipeEnd(_event, direction) {
      if (direction === 'left') next()
      else if (direction === 'right') previous()
    }
  })

  watch(count, (total) => {
    if (index.value >= total) go(total - 1)
  })

  const dragOffset = computed(() => (isSwiping.value ? -distanceX.value : 0))

  return { index: readonly(index), go, next, previous, dragOffset, isSwiping }
}
