import { jobPageSchema } from '#shared/schemas/job'
import type { JobPage, JobPageMeta, JobSection } from '#shared/types/job'

/** Draft-based editing: changes stay local until `save()` persists them through the repository. */
export async function useJobEditor(slug: string) {
  const repository = useJobRepository()
  const { page, refresh } = await useJobPage(slug)

  const snapshot = (): JobPage => structuredClone(toRaw(page.value))
  const draft = ref<JobPage>(snapshot())
  const isEditing = ref(false)
  const isSaving = ref(false)
  const error = ref<string | null>(null)

  const isDirty = computed(() => JSON.stringify(draft.value) !== JSON.stringify(page.value))
  const validationErrors = computed<string[]>(() => {
    const result = jobPageSchema.safeParse(draft.value)
    return result.success ? [] : [...new Set(result.error.issues.map((issue) => issue.message))]
  })

  function start(): void {
    error.value = null
    isEditing.value = true
  }

  function cancel(): void {
    draft.value = snapshot()
    error.value = null
    isEditing.value = false
  }

  async function save(): Promise<void> {
    if (validationErrors.value.length > 0) return
    isSaving.value = true
    error.value = null
    try {
      await repository.save(toRaw(draft.value))
      await refresh()
      // The schema trims text, so resync or the draft would stay "dirty".
      draft.value = snapshot()
      isEditing.value = false
    } catch (cause) {
      error.value = cause instanceof Error ? cause.message : 'Échec de l’enregistrement.'
    } finally {
      isSaving.value = false
    }
  }

  function updateMeta(meta: JobPageMeta): void {
    draft.value = { ...draft.value, ...meta }
  }

  function updateSection(section: JobSection): void {
    draft.value = { ...draft.value, sections: replaceById(draft.value.sections, section) }
  }

  function moveSection(id: string, direction: MoveDirection): void {
    draft.value = { ...draft.value, sections: moveById(draft.value.sections, id, direction) }
  }

  return {
    draft: computed(() => draft.value),
    isEditing: readonly(isEditing),
    isSaving: readonly(isSaving),
    isDirty,
    validationErrors,
    error: readonly(error),
    start,
    cancel,
    save,
    updateMeta,
    updateSection,
    moveSection
  }
}
