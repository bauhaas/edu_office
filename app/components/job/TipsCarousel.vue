<script setup lang="ts">
import type { CSSProperties } from 'vue'
import type { Tip } from '#shared/types/job'

const props = defineProps<{ tips: readonly Tip[]; label: string }>()

const stack = useTemplateRef('stack')
const { index, go, next, previous, dragOffset, isSwiping } = useCarousel(stack, () => props.tips.length)
const hasSeveral = computed(() => props.tips.length > 1)

const STACK_DEPTH = 3
const BACK_TILTS = [0, 4, -5] as const

/** Position of a card relative to the active one: 0 = front, 1..n = behind. */
const depthOf = (itemIndex: number): number => {
  const total = props.tips.length
  return (itemIndex - index.value + total) % total
}

function cardStyle(itemIndex: number): CSSProperties {
  const depth = depthOf(itemIndex)
  if (depth === 0) {
    return {
      zIndex: STACK_DEPTH + 1,
      transform: `translateX(${dragOffset.value}px) rotate(${dragOffset.value / 20}deg)`,
      transition: isSwiping.value ? 'none' : undefined
    }
  }
  const visible = depth < STACK_DEPTH
  return {
    zIndex: STACK_DEPTH - depth,
    opacity: visible ? 1 : 0,
    transform: `translateY(${-depth * 10}px) scale(${1 - depth * 0.04}) rotate(${BACK_TILTS[depth] ?? 0}deg)`
  }
}
</script>

<template>
  <div
    class="space-y-5"
    role="region"
    aria-roledescription="carrousel"
    :aria-label="label"
    tabindex="0"
    @keydown.left.prevent="previous"
    @keydown.right.prevent="next"
  >
    <div class="relative flex items-center justify-center">
      <button v-if="hasSeveral" type="button" class="carousel-arrow left-0" aria-label="Conseil précédent" @click="previous">
        <Icon name="lucide:chevron-left" class="size-5" />
      </button>

      <div ref="stack" class="relative aspect-square w-[72%] touch-pan-y select-none" aria-live="polite">
        <article
          v-for="(tip, itemIndex) in tips"
          :key="tip.id"
          class="absolute inset-0 flex flex-col items-center justify-center gap-6 rounded-card bg-surface px-6 text-center shadow-card ring-1 ring-black/5 transition-[transform,opacity] duration-500 ease-[cubic-bezier(0.34,1.4,0.64,1)]"
          :class="{ 'cursor-grab active:cursor-grabbing': hasSeveral }"
          :style="cardStyle(itemIndex)"
          :aria-hidden="depthOf(itemIndex) !== 0"
          :aria-label="`Conseil ${itemIndex + 1} sur ${tips.length}`"
        >
          <Icon :name="tip.icon" class="text-5xl" aria-hidden="true" />
          <p class="text-[15px] leading-snug font-medium text-balance">{{ tip.text }}</p>
        </article>
      </div>

      <button v-if="hasSeveral" type="button" class="carousel-arrow right-0" aria-label="Conseil suivant" @click="next">
        <Icon name="lucide:chevron-right" class="size-5" />
      </button>
    </div>

    <div v-if="hasSeveral" class="flex justify-center">
      <button
        v-for="(tip, itemIndex) in tips"
        :key="tip.id"
        type="button"
        class="group grid h-6 place-items-center px-0.5"
        :aria-label="`Aller au conseil ${itemIndex + 1}`"
        :aria-current="itemIndex === index"
        @click="go(itemIndex)"
      >
        <span
          class="block h-1.5 rounded-full transition-all duration-300"
          :class="itemIndex === index ? 'w-3 bg-ink' : 'w-1.5 bg-ink/25 group-hover:bg-ink/50'"
        />
      </button>
    </div>
  </div>
</template>

<style scoped>
@reference "~/assets/css/main.css";

.carousel-arrow {
  @apply absolute top-1/2 z-10 grid size-9 -translate-y-1/2 place-items-center rounded-full bg-white/80 text-ink shadow-card backdrop-blur transition-transform hover:bg-white active:scale-90;
}
</style>
