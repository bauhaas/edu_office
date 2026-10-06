<script setup lang="ts">
withDefaults(defineProps<{ label: string; canMoveUp: boolean; canMoveDown: boolean; removable?: boolean }>(), { removable: true })
defineEmits<{ move: [direction: MoveDirection]; remove: [] }>()
const isEditing = useEditMode()
</script>

<template>
  <div
    v-if="isEditing"
    class="absolute -top-3 right-2 z-20 flex gap-0.5 rounded-full bg-ink p-1 text-white shadow-card"
    role="toolbar"
    :aria-label="`Actions : ${label}`"
  >
    <button type="button" class="control-btn" :disabled="!canMoveUp" aria-label="Monter" @click="$emit('move', -1)">
      <Icon name="lucide:arrow-up" />
    </button>
    <button type="button" class="control-btn" :disabled="!canMoveDown" aria-label="Descendre" @click="$emit('move', 1)">
      <Icon name="lucide:arrow-down" />
    </button>
    <button v-if="removable" type="button" class="control-btn hover:bg-red-500" aria-label="Supprimer" @click="$emit('remove')">
      <Icon name="lucide:trash-2" />
    </button>
  </div>
</template>
