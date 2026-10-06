<script setup lang="ts">
import type { AboutStats, SectionOf } from '#shared/types/job'

type Section = SectionOf<'about'>

const props = defineProps<{ section: Section }>()
const emit = defineEmits<{ update: [section: Section] }>()

const patch = useSectionPatch(() => props.section, (next) => emit('update', next))
const isEditing = useEditMode()
const isExpanded = ref(false)

const patchStats = (changes: Partial<AboutStats>): void => patch({ stats: { ...props.section.stats, ...changes } })
</script>

<template>
  <div class="space-y-5">
    <UiSectionTitle v-if="isEditing || section.title">
      <EditorEditableText :model-value="section.title" label="Titre" @update:model-value="patch({ title: $event })" />
    </UiSectionTitle>

    <div v-if="isEditing || section.body" class="space-y-3">
      <p class="text-[15px] leading-relaxed text-ink" :class="{ 'line-clamp-3': !isExpanded && !isEditing }">
        <EditorEditableText :model-value="section.body" label="Texte" multiline @update:model-value="patch({ body: $event })" />
      </p>
      <UiPill v-if="!isEditing" :aria-expanded="isExpanded" @click="isExpanded = !isExpanded">
        {{ isExpanded ? 'Réduire' : 'Lire la suite' }}
      </UiPill>
    </div>

    <dl class="grid grid-cols-2 gap-x-6 gap-y-5 pt-1">
      <JobStatItem icon="fluent-emoji:money-bag">
        <template #value>
          <EditorEditableNumber
            :model-value="section.stats.medianStartingSalary"
            :format="formatEuros"
            label="Salaire médian"
            @update:model-value="patchStats({ medianStartingSalary: $event })"
          />
        </template>
        salaire médian en début de carrière
      </JobStatItem>

      <JobStatItem icon="fluent-emoji:rocket">
        <template #value>
          <EditorEditableNumber
            :model-value="section.stats.openPositions.count"
            :format="formatInteger"
            label="Postes à pourvoir"
            @update:model-value="patchStats({ openPositions: { ...section.stats.openPositions, count: $event } })"
          />
        </template>
        postes à pourvoir en
        <EditorEditableNumber
          :model-value="section.stats.openPositions.year"
          label="Année"
          :min="1900"
          :max="2100"
          @update:model-value="patchStats({ openPositions: { ...section.stats.openPositions, year: $event } })"
        />
      </JobStatItem>

      <JobStatItem icon="fluent-emoji:cook">
        <template #value>
          <EditorEditableNumber
            :model-value="section.stats.professionalsCount"
            :format="formatLargeCount"
            label="Nombre de professionnels"
            @update:model-value="patchStats({ professionalsCount: $event })"
          />
        </template>
        de professionnels en France
      </JobStatItem>

      <JobStatItem icon="fluent-emoji:graduation-cap">
        <template #value>
          <EditorEditableNumber
            :model-value="section.stats.trainingsCount"
            :format="formatInteger"
            label="Formations référencées"
            @update:model-value="patchStats({ trainingsCount: $event })"
          />
        </template>
        formations référencées
      </JobStatItem>
    </dl>
  </div>
</template>
