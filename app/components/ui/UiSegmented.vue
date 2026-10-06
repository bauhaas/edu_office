<script setup lang="ts" generic="T extends string">
export interface SegmentOption<V extends string> {
  value: V
  label: string
  emoji?: string
}

defineProps<{ options: readonly SegmentOption<T>[]; label: string }>()
const model = defineModel<T>({ required: true })
</script>

<template>
  <div class="grid auto-cols-fr grid-flow-col gap-1" role="tablist" :aria-label="label">
    <button
      v-for="option in options"
      :key="option.value"
      type="button"
      role="tab"
      :aria-selected="model === option.value"
      class="flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-[15px] font-medium transition-colors duration-300"
      :class="model === option.value ? 'bg-surface-muted text-ink' : 'text-ink hover:bg-surface-muted/60'"
      @click="model = option.value"
    >
      <span v-if="option.emoji" aria-hidden="true">{{ option.emoji }}</span>
      {{ option.label }}
    </button>
  </div>
</template>
