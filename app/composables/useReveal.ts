import type { MaybeElementRef } from '@vueuse/core'

/** Flips to `true` the first time the element scrolls into view. */
export function useReveal(target: MaybeElementRef, threshold = 0.15) {
  const isRevealed = ref(false)

  const { stop } = useIntersectionObserver(
    target,
    ([entry]) => {
      if (!entry?.isIntersecting) return
      isRevealed.value = true
      stop()
    },
    { threshold }
  )

  return { isRevealed }
}
