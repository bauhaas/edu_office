<script setup lang="ts">
import type { SectionOf } from '#shared/types/job'

type Section = SectionOf<'cta'>

const props = defineProps<{ section: Section }>()
const emit = defineEmits<{ update: [section: Section] }>()

const patch = useSectionPatch(() => props.section, (next) => emit('update', next))
const isEditing = useEditMode()

const card = useTemplateRef('card')
const { isRevealed } = useReveal(card, 0.3)
</script>

<template>
  <div ref="card" class="relative isolate overflow-hidden rounded-card bg-surface-warm px-4 pt-14 pb-5 text-center">
    <img
      src="/images/sticker-boarding-pass.png"
      alt=""
      class="deco -top-4 -left-6 w-24 rotate-[160deg]"
      :class="{ 'is-in': isRevealed }"
    >
    <img src="/images/sticker-fork.png" alt="" class="deco top-10 -left-10 w-28 rotate-[24deg]" :class="{ 'is-in': isRevealed }">
    <img src="/images/sticker-key.png" alt="" class="deco -top-6 -right-8 w-28 -rotate-[24deg]" :class="{ 'is-in': isRevealed }">
    <img src="/images/sticker-bell.png" alt="" class="deco top-20 -right-8 w-16" :class="{ 'is-in': isRevealed }">

    <h2 class="mx-auto max-w-[14ch] text-[22px] leading-tight font-semibold text-balance">
      <EditorEditableText :model-value="section.title" label="Titre" @update:model-value="patch({ title: $event })" />
    </h2>
    <p class="mt-3 text-[15px] text-ink-muted">
      <EditorEditableText :model-value="section.subtitle" label="Sous-titre" @update:model-value="patch({ subtitle: $event })" />
    </p>

    <component
      :is="isEditing ? 'div' : 'a'"
      :href="isEditing ? undefined : section.href"
      :target="isEditing ? undefined : '_blank'"
      rel="noopener noreferrer"
      class="mt-10 block rounded-2xl bg-ink px-6 py-4 text-[17px] font-medium text-white transition-transform active:scale-[0.98]"
    >
      <EditorEditableText :model-value="section.buttonLabel" label="Libellé du bouton" @update:model-value="patch({ buttonLabel: $event })" />
    </component>
    <label v-if="isEditing" class="mt-2 flex items-center gap-2 text-left text-xs text-ink-muted">
      <Icon name="lucide:link" class="size-4 shrink-0" />
      <input
        type="url"
        :value="section.href"
        aria-label="Lien du bouton"
        class="editable-field"
        @change="patch({ href: ($event.target as HTMLInputElement).value })"
      >
    </label>
  </div>
</template>

<style scoped>
.deco {
  position: absolute;
  z-index: -1;
  pointer-events: none;
  opacity: 0;
  translate: 0 12px;
  transition: opacity 0.6s ease, translate 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.deco.is-in {
  opacity: 1;
  translate: 0 0;
}
</style>
