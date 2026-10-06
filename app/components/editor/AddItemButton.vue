<script setup lang="ts">
defineEmits<{ add: [] }>()
const isEditing = useEditMode()
</script>

<template>
  <button
    v-if="isEditing"
    type="button"
    class="flex w-full items-center justify-center gap-2 rounded-tile border-2 border-dashed border-sky-400/70 py-3 text-sm font-medium text-sky-700 transition-colors hover:bg-sky-50"
    @click="$emit('add')"
  >
    <Icon name="lucide:plus" class="size-4" />
    <slot />
  </button>
</template>
