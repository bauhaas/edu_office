<script setup lang="ts">
import type { JobPage, JobPageMeta, JobSection } from '#shared/types/job'
import { sectionRegistry } from './sectionRegistry'

defineProps<{ page: JobPage }>()
defineEmits<{
  'update:meta': [meta: JobPageMeta]
  'update:section': [section: JobSection]
  'move:section': [id: string, direction: MoveDirection]
}>()
</script>

<template>
  <main class="mx-auto flex min-h-dvh w-full max-w-[430px] flex-col overflow-x-clip bg-surface">
    <slot name="top" />
    <JobHero
      class="pt-6 pb-10"
      :meta="{ title: page.title, tagline: page.tagline }"
      @update="$emit('update:meta', $event)"
    />

    <JobSectionShell
      v-for="(section, index) in page.sections"
      :key="section.id"
      :label="sectionRegistry[section.type].label"
      :can-move-up="index > 0"
      :can-move-down="index < page.sections.length - 1"
      class="px-5 py-10"
      :class="sectionRegistry[section.type].tone === 'gradient'
        ? 'bg-gradient-page-top'
        : 'border-line not-first-of-type:border-t-8'"
      @move="$emit('move:section', section.id, $event)"
    >
      <component
        :is="sectionRegistry[section.type].component"
        :section="section"
        @update="$emit('update:section', $event)"
      />
    </JobSectionShell>

    <JobCollageFooter class="bg-gradient-page-bottom -mt-px" />
  </main>
</template>
