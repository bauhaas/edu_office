<script setup lang="ts">
import { MAX_LONG_TEXT, MAX_SHORT_TEXT } from '#shared/schemas/job'

const props = withDefaults(defineProps<{ label: string; multiline?: boolean; required?: boolean; maxlength?: number }>(), {
  multiline: false,
  required: false,
  maxlength: undefined
})
const model = defineModel<string>({ required: true })
const isEditing = useEditMode()

const isMissing = computed(() => props.required && model.value.trim() === '')

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
    :aria-required="required"
    :aria-invalid="isMissing"
    :placeholder="required ? `${label} (obligatoire)` : `${label} (facultatif)`"
    :maxlength="maxlength ?? (multiline ? MAX_LONG_TEXT : MAX_SHORT_TEXT)"
    rows="1"
    class="editable-field"
    :class="{ 'is-missing': isMissing }"
    @keydown.enter="onEnter"
  />
</template>
