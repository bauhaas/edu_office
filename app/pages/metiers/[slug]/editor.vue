<script setup lang="ts">
const slug = useSlugParam()
const editor = await useJobEditor(slug)
const { draft, isEditing, isDirty, isSaving, error } = editor

provideEditMode(isEditing)

useHead({ title: () => `Éditeur · ${draft.value.title}` })

onBeforeRouteLeave(() => !isDirty.value || window.confirm('Quitter sans enregistrer les modifications ?'))
useEventListener('beforeunload', (event: BeforeUnloadEvent) => {
  if (isDirty.value) event.preventDefault()
})
</script>

<template>
  <div>
    <JobPage
      :page="draft"
      @update:meta="editor.updateMeta"
      @update:section="editor.updateSection"
      @move:section="editor.moveSection"
    >
      <template #top>
        <EditorToolbar
          :is-editing="isEditing"
          :is-dirty="isDirty"
          :is-saving="isSaving"
          :error="error"
          :public-path="`/metiers/${slug}`"
          @start="editor.start"
          @cancel="editor.cancel"
          @save="editor.save"
        />
      </template>
    </JobPage>
  </div>
</template>
