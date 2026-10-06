<script setup lang="ts">
const props = withDefaults(
  defineProps<{ label: string; format?: (value: number) => string; min?: number }>(),
  { format: (value: number) => String(value), min: 0 }
)
const model = defineModel<number>({ required: true })
const isEditing = useEditMode()

function onInput(event: Event): void {
  const value = (event.target as HTMLInputElement).valueAsNumber
  if (Number.isFinite(value) && value >= props.min) model.value = value
}
</script>

<template>
  <template v-if="!isEditing">{{ format(model) }}</template>
  <input
    v-else
    type="number"
    inputmode="numeric"
    :min="min"
    :value="model"
    :aria-label="label"
    class="editable-field"
    @input="onInput"
  >
</template>
