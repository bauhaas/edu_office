import type { JobPage } from '#shared/types/job'

async function loadOrThrow(slug: string): Promise<JobPage> {
  const page = await useJobRepository().find(slug)
  if (!page) throw createError({ statusCode: 404, message: 'Métier introuvable', fatal: true })
  return page
}

/**
 * Loads a job page and raises a 404 when the slug is unknown.
 * Pages are client-rendered (localStorage), so a local ref is enough; no SSR payload to share.
 */
export async function useJobPage(slug: string) {
  const page = shallowRef<JobPage>(await loadOrThrow(slug))

  async function refresh(): Promise<void> {
    page.value = await loadOrThrow(slug)
  }

  useHead({ title: () => `${page.value.title} | Edumapper` })

  return { page: computed(() => page.value), refresh }
}
