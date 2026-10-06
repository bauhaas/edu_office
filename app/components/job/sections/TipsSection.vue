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
const { index, go, dragOffset, isSwiping } = useCarousel(stack, () => props.section.items.length)

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
        <div class="mx-auto mb-3 w-14 text-4xl">
          <EditorEditableText :model-value="tip.emoji" label="Emoji" @update:model-value="patchItem(tip, { emoji: $event })" />
        </div>
        <p class="text-[15px] leading-snug font-medium">
          <EditorEditableText :model-value="tip.text" label="Conseil" multiline @update:model-value="patchItem(tip, { text: $event })" />
        </p>
      </li>
      <li>
        <EditorAddItemButton @add="addItem(createTip())">Ajouter un conseil</EditorAddItemButton>
      </li>
    </ul>

    <template v-else-if="section.items.length > 0">
      <div
        ref="stack"
        class="relative mx-auto aspect-square w-[72%] touch-pan-y select-none"
        role="region"
        aria-roledescription="carrousel"
        :aria-label="section.title"
      >
        <article
          v-for="(tip, itemIndex) in section.items"
          :key="tip.id"
          class="absolute inset-0 flex cursor-grab flex-col items-center justify-center gap-6 rounded-card bg-surface px-6 text-center shadow-card ring-1 ring-black/5 transition-[transform,opacity] duration-500 ease-[cubic-bezier(0.34,1.4,0.64,1)] active:cursor-grabbing"
          :style="cardStyle(itemIndex)"
          :aria-hidden="depthOf(itemIndex) !== 0"
        >
          <span class="text-5xl" aria-hidden="true">{{ tip.emoji }}</span>
          <p class="text-[15px] leading-snug font-medium text-balance">{{ tip.text }}</p>
        </article>
      </div>

      <div class="flex justify-center gap-1.5">
        <button
          v-for="(tip, itemIndex) in section.items"
          :key="tip.id"
          type="button"
          class="h-1.5 rounded-full transition-all duration-300"
          :class="itemIndex === index ? 'w-3 bg-ink' : 'w-1.5 bg-ink/25'"
          :aria-label="`Conseil ${itemIndex + 1}`"
          :aria-current="itemIndex === index"
          @click="go(itemIndex)"
        />
      </div>
    </template>
  </div>
</template>
