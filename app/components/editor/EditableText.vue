<script setup lang="ts">
const props = withDefaults(defineProps<{ label: string; multiline?: boolean }>(), { multiline: false })
const model = defineModel<string>({ required: true })
const isEditing = useEditMode()

function onEnter(event: KeyboardEvent): void {
  if (!props.multiline) event.preventDefault()
}
</script>

<template>
  <template v-if="!isEditing">{{ model }}</template>
  <textarea
    v-else
    v-model="model"
    :aria-label="label"
    rows="1"
    class="editable-field"
    @keydown.enter="onEnter"
  />
</template>
