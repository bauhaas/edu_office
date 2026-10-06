<script setup lang="ts">
import type { SectionOf } from '#shared/types/job'

type Section = SectionOf<'subjobs'>

const props = defineProps<{ section: Section }>()
const emit = defineEmits<{ update: [section: Section] }>()

const { updateItem, removeItem, moveItem, addItem } = useListSection(() => props.section, (next) => emit('update', next))

const TILTS = [-4, 4, -3, 3] as const

const grid = useTemplateRef('grid')
const { isRevealed } = useReveal(grid)
</script>

<template>
  <div class="space-y-6">
    <ul ref="grid" class="grid grid-cols-2 gap-x-3 gap-y-10">
      <li v-for="(subjob, index) in section.items" :key="subjob.id" class="relative">
        <EditorItemControls
          :label="subjob.label"
          :can-move-up="index > 0"
          :can-move-down="index < section.items.length - 1"
          @move="moveItem(subjob.id, $event)"
          @remove="removeItem(subjob.id)"
        />
        <JobSubjobCard
          :subjob="subjob"
          :tilt="cycleAt(TILTS, index)"
          :revealed="isRevealed"
          :style="{ transitionDelay: `${index * 80}ms` }"
          @update="updateItem"
        />
      </li>
    </ul>
    <EditorAddItemButton @add="addItem(createSubjob())">Ajouter un métier</EditorAddItemButton>
  </div>
</template>
