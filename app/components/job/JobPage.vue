<script setup lang="ts">
import type { JobPage, JobPageMeta, JobSection } from '#shared/types/job'
import { definitionOf, isSectionEmpty, type SectionTone } from './sectionRegistry'

const props = defineProps<{ page: JobPage; intro?: boolean }>()
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

const [DefineSections, ReuseSections] = createReusableTemplate()

const isEditing = useEditMode()
const entries = computed(() =>
  props.page.sections
    .filter((section) => isEditing.value || !isSectionEmpty(section))
    .map((section) => ({ section, definition: definitionOf(section) }))
)

/** Separators only split two consecutive plain sections. */
const hasSeparatorBefore = (index: number): boolean =>
  entries.value[index]?.definition.tone === 'plain' && entries.value[index - 1]?.definition.tone === 'plain'
</script>

<template>
  <main class="mx-auto flex min-h-dvh w-full max-w-page flex-col overflow-x-clip bg-surface">
    <DefineSections>
      <template v-for="({ section, definition }, index) in entries" :key="section.id">
        <UiSeparator v-if="hasSeparatorBefore(index)" />
        <JobSectionShell
          :label="definition.label"
          :can-move-up="index > 0"
          :can-move-down="index < entries.length - 1"
          :class="[TONE_CLASSES[definition.tone], definition.flush ? '-mt-px' : 'px-5 py-10']"
          @move="$emit('move:section', section.id, $event)"
        >
          <component
            :is="definition.component"
            :section="section"
            @update="$emit('update:section', $event)"
          />
        </JobSectionShell>
      </template>
    </DefineSections>

    <slot name="top" />
    <JobIntroHero v-if="intro" :title="page.title" :tagline="page.tagline">
      <ReuseSections />
    </JobIntroHero>
    <template v-else>
      <JobHero
        class="pt-6 pb-10"
        :meta="{ title: page.title, tagline: page.tagline }"
        @update="$emit('update:meta', $event)"
      />
      <ReuseSections />
    </template>
  </main>
</template>
