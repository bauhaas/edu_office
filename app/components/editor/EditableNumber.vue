<script setup lang="ts">
const props = withDefaults(
  defineProps<{ label: string; format?: (value: number) => string; min?: number; max?: number }>(),
  { format: (value: number) => String(value), min: 0, max: 1_000_000_000 }
)
const model = defineModel<number>({ required: true })
const isEditing = useEditMode()

function onInput(event: Event): void {
  const value = (event.target as HTMLInputElement).valueAsNumber
  if (Number.isInteger(value) && value >= props.min && value <= props.max) model.value = value
}
</script>

<template>
  <template v-if="!isEditing">{{ format(model) }}</template>
  <input
    v-else
    type="number"
    inputmode="numeric"
    step="1"
    :min="min"
    :max="max"
    :value="model"
    :aria-label="label"
    class="editable-field"
    @input="onInput"
  >
</template>
