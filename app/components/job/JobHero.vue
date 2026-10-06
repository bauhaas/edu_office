<script setup lang="ts">
import type { JobPageMeta } from '#shared/types/job'

const props = defineProps<{ meta: JobPageMeta }>()
const emit = defineEmits<{ update: [meta: JobPageMeta] }>()

const patch = (changes: Partial<JobPageMeta>): void => emit('update', { ...props.meta, ...changes })
</script>

<template>
  <header class="space-y-5 px-6 pt-4 text-center">
    <h1 class="mx-auto max-w-[14ch] text-[28px] leading-[1.2] font-semibold text-balance">
      <EditorEditableText :model-value="meta.title" label="Titre du métier" @update:model-value="patch({ title: $event })" />
    </h1>
    <p class="mx-auto max-w-[26ch] text-[15px] leading-snug text-ink-muted text-balance">
      <EditorEditableText :model-value="meta.tagline" label="Accroche" multiline @update:model-value="patch({ tagline: $event })" />
    </p>
  </header>
</template>
