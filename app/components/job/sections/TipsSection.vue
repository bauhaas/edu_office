<script setup lang="ts">
import type { SectionOf } from '#shared/types/job'

type Section = SectionOf<'tips'>

const props = defineProps<{ section: Section }>()
const emit = defineEmits<{ update: [section: Section] }>()

const update = (next: Section): void => emit('update', next)
const patch = useSectionPatch(() => props.section, update)
const { patchItem, removeItem, moveItem, addItem } = useListSection(() => props.section, update)
const isEditing = useEditMode()
</script>

<template>
  <div class="space-y-8">
    <UiSectionTitle v-if="isEditing || section.title" centered class="mx-auto max-w-[16ch] text-balance">
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
          <EditorEditableText :model-value="tip.icon" label="Icône (ex. fluent-emoji:rocket)" required :maxlength="80" @update:model-value="patchItem(tip, { icon: $event })" />
        </p>
        <p class="text-[15px] leading-snug font-medium">
          <EditorEditableText :model-value="tip.text" label="Conseil" multiline required @update:model-value="patchItem(tip, { text: $event })" />
        </p>
      </li>
      <li>
        <EditorAddItemButton @add="addItem(createTip())">Ajouter un conseil</EditorAddItemButton>
      </li>
    </ul>

    <JobTipsCarousel v-else-if="section.items.length > 0" :tips="section.items" :label="section.title || 'Conseils'" />
  </div>
</template>
