<script setup lang="ts">
import type { JobPage, JobPageMeta, JobSection } from '#shared/types/job'
import { sectionRegistry, type SectionTone } from './sectionRegistry'

const props = defineProps<{ page: JobPage }>()
defineEmits<{
  'update:meta': [meta: JobPageMeta]
  'update:section': [section: JobSection]
  'move:section': [id: string, direction: MoveDirection]
}>()

const TONE_CLASSES: Readonly<Record<SectionTone, string>> = {
  plain: 'bg-surface',
  gradientTop: 'bg-gradient-page-top',
  gradientBottom: 'bg-gradient-page-bottom'
}

const definitionOf = (section: JobSection) => sectionRegistry[section.type]

const isPlain = (section: JobSection | undefined): boolean => section !== undefined && definitionOf(section).tone === 'plain'

/** Separators only split two consecutive plain sections. */
const hasSeparatorBefore = (index: number): boolean =>
  isPlain(props.page.sections[index]) && isPlain(props.page.sections[index - 1])
</script>

<template>
  <main class="mx-auto flex min-h-dvh w-full max-w-[430px] flex-col overflow-x-clip bg-surface">
    <slot name="top" />
    <JobHero
      class="pt-6 pb-10"
      :meta="{ title: page.title, tagline: page.tagline }"
      @update="$emit('update:meta', $event)"
    />

    <template v-for="(section, index) in page.sections" :key="section.id">
      <UiSeparator v-if="hasSeparatorBefore(index)" />
      <JobSectionShell
        :label="definitionOf(section).label"
        :can-move-up="index > 0"
        :can-move-down="index < page.sections.length - 1"
        :class="[TONE_CLASSES[definitionOf(section).tone], definitionOf(section).flush ? '-mt-px' : 'px-5 py-10']"
        @move="$emit('move:section', section.id, $event)"
      >
        <component
          :is="definitionOf(section).component"
          :section="section"
          @update="$emit('update:section', $event)"
        />
      </JobSectionShell>
    </template>
  </main>
</template>
