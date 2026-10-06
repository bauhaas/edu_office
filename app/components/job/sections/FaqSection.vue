<script setup lang="ts">
import type { FaqItem, SectionOf } from '#shared/types/job'

type Section = SectionOf<'faq'>

const props = defineProps<{ section: Section }>()
const emit = defineEmits<{ update: [section: Section] }>()

const update = (next: Section): void => emit('update', next)
const patch = useSectionPatch(() => props.section, update)
const { updateItem, removeItem, moveItem, addItem } = useListSection(() => props.section, update)

const isEditing = useEditMode()
const openId = ref<string | null>(null)

const isOpen = (id: string): boolean => isEditing.value || openId.value === id
const toggle = (id: string): void => {
  openId.value = openId.value === id ? null : id
}
const patchItem = (item: FaqItem, changes: Partial<Omit<FaqItem, 'id'>>): void => updateItem({ ...item, ...changes })
</script>

<template>
  <div class="space-y-5">
    <UiSectionTitle>
      <EditorEditableText :model-value="section.title" label="Titre" @update:model-value="patch({ title: $event })" />
    </UiSectionTitle>

    <ul class="space-y-3">
      <li v-for="(item, index) in section.items" :key="item.id" class="relative rounded-tile bg-surface-muted">
        <EditorItemControls
          :label="item.question"
          :can-move-up="index > 0"
          :can-move-down="index < section.items.length - 1"
          @move="moveItem(item.id, $event)"
          @remove="removeItem(item.id)"
        />
        <h3>
          <component
            :is="isEditing ? 'div' : 'button'"
            :type="isEditing ? undefined : 'button'"
            class="flex w-full items-center gap-4 px-4 py-4 text-left text-[15px] leading-snug font-medium"
            :aria-expanded="isOpen(item.id)"
            :aria-controls="`faq-${item.id}`"
            @click="isEditing || toggle(item.id)"
          >
            <span class="flex-1">
              <EditorEditableText :model-value="item.question" label="Question" @update:model-value="patchItem(item, { question: $event })" />
            </span>
            <Icon
              v-if="!isEditing"
              name="lucide:plus"
              class="size-5 shrink-0 transition-transform duration-300"
              :class="{ 'rotate-45': isOpen(item.id) }"
              aria-hidden="true"
            />
          </component>
        </h3>
        <UiCollapse :id="`faq-${item.id}`" :open="isOpen(item.id)">
          <p class="px-4 pb-4 text-[15px] leading-relaxed text-ink-muted">
            <EditorEditableText :model-value="item.answer" label="Réponse" multiline @update:model-value="patchItem(item, { answer: $event })" />
          </p>
        </UiCollapse>
      </li>
    </ul>

    <EditorAddItemButton @add="addItem(createFaqItem())">Ajouter une question</EditorAddItemButton>
  </div>
</template>
