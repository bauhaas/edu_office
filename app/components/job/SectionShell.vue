<script setup lang="ts">
defineProps<{ label: string; canMoveUp: boolean; canMoveDown: boolean }>()
defineEmits<{ move: [direction: MoveDirection] }>()

const isEditing = useEditMode()
const root = useTemplateRef('root')
const { isRevealed } = useReveal(root, 0.08)
</script>

<template>
  <section
    ref="root"
    class="relative transition-[opacity,translate] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
    :class="[
      isRevealed ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0',
      { 'rounded-2xl outline-2 outline-offset-8 outline-dashed outline-sky-300': isEditing }
    ]"
    :aria-label="label"
  >
    <div v-if="isEditing" class="absolute -top-7 left-0 z-20 flex items-center gap-1 rounded-full bg-sky-600 py-0.5 pr-1 pl-3 text-xs font-medium text-white">
      {{ label }}
      <button type="button" class="control-btn size-6" :disabled="!canMoveUp" aria-label="Monter la section" @click="$emit('move', -1)">
        <Icon name="lucide:chevron-up" />
      </button>
      <button type="button" class="control-btn size-6" :disabled="!canMoveDown" aria-label="Descendre la section" @click="$emit('move', 1)">
        <Icon name="lucide:chevron-down" />
      </button>
    </div>
    <slot />
  </section>
</template>
