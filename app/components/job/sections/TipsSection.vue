<script setup lang="ts">
import type { CSSProperties } from 'vue'
import type { SectionOf, Tip } from '#shared/types/job'

type Section = SectionOf<'tips'>

const props = defineProps<{ section: Section }>()
const emit = defineEmits<{ update: [section: Section] }>()

const update = (next: Section): void => emit('update', next)
const patch = useSectionPatch(() => props.section, update)
const { updateItem, removeItem, moveItem, addItem } = useListSection(() => props.section, update)
const isEditing = useEditMode()

const stack = useTemplateRef('stack')
const { index, go, next, previous, dragOffset, isSwiping } = useCarousel(stack, () => props.section.items.length)
const hasSeveral = computed(() => props.section.items.length > 1)

const STACK_DEPTH = 3
const BACK_TILTS = [0, 4, -5] as const

/** Position of a card relative to the active one: 0 = front, 1..n = behind. */
const depthOf = (itemIndex: number): number => {
  const total = props.section.items.length
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

const patchItem = (item: Tip, changes: Partial<Omit<Tip, 'id'>>): void => updateItem({ ...item, ...changes })
</script>

<template>
  <div class="space-y-8">
    <UiSectionTitle centered class="mx-auto max-w-[16ch] text-balance">
      <EditorEditableText :model-value="section.title" label="Titre" @update:model-value="patch({ title: $event })" />
    </UiSectionTitle>

    <ul v-if="isEditing" class="space-y-4">
      <li v-for="(tip, itemIndex) in section.items" :key="tip.id" class="relative rounded-card bg-surface p-5 text-center shadow-card">
        <EditorItemControls
          :label="tip.text"
          :can-move-up="itemIndex > 0"
          :can-move-down="itemIndex < section.items.length - 1"
          @move="moveItem(tip.id, $event)"
          @remove="removeItem(tip.id)"
        />
        <Icon :name="tip.icon" class="mx-auto mb-1 block text-4xl" aria-hidden="true" />
        <p class="mb-3 text-xs text-ink-muted">
          <EditorEditableText :model-value="tip.icon" label="Icône (ex. fluent-emoji:rocket)" @update:model-value="patchItem(tip, { icon: $event })" />
        </p>
        <p class="text-[15px] leading-snug font-medium">
          <EditorEditableText :model-value="tip.text" label="Conseil" multiline @update:model-value="patchItem(tip, { text: $event })" />
        </p>
      </li>
      <li>
        <EditorAddItemButton @add="addItem(createTip())">Ajouter un conseil</EditorAddItemButton>
      </li>
    </ul>

    <div
      v-else-if="section.items.length > 0"
      class="space-y-5"
      role="region"
      aria-roledescription="carrousel"
      :aria-label="section.title"
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
            v-for="(tip, itemIndex) in section.items"
            :key="tip.id"
            class="absolute inset-0 flex flex-col items-center justify-center gap-6 rounded-card bg-surface px-6 text-center shadow-card ring-1 ring-black/5 transition-[transform,opacity] duration-500 ease-[cubic-bezier(0.34,1.4,0.64,1)]"
            :class="{ 'cursor-grab active:cursor-grabbing': hasSeveral }"
            :style="cardStyle(itemIndex)"
            :aria-hidden="depthOf(itemIndex) !== 0"
            :aria-label="`Conseil ${itemIndex + 1} sur ${section.items.length}`"
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
          v-for="(tip, itemIndex) in section.items"
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
  </div>
</template>

<style scoped>
@reference "~/assets/css/main.css";

.carousel-arrow {
  @apply absolute top-1/2 z-10 grid size-9 -translate-y-1/2 place-items-center rounded-full bg-white/80 text-ink shadow-card backdrop-blur transition-transform hover:bg-white active:scale-90;
}
</style>
