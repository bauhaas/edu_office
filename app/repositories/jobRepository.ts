import { jobPageSchema } from '#shared/schemas/job'
import type { JobPage } from '#shared/types/job'
import { defaultJobPages } from '~/data/jobs'

/** Async contract so the localStorage backend can be swapped for an API without touching callers. */
export interface JobRepository {
  find(slug: string): Promise<JobPage | null>
  save(page: JobPage): Promise<void>
}

// Bump when the schema changes incompatibly; older drafts are then ignored.
const STORAGE_PREFIX = 'edumapper:job:v4:'

const storageKey = (slug: string): string => `${STORAGE_PREFIX}${slug}`

function readStored(slug: string): JobPage | null {
  const raw = localStorage.getItem(storageKey(slug))
  if (raw === null) return null

  try {
    const parsed = jobPageSchema.safeParse(JSON.parse(raw))
    if (parsed.success) return parsed.data
    console.warn(`[jobRepository] Ignoring invalid stored page "${slug}"`, parsed.error.issues)
  } catch {
    console.warn(`[jobRepository] Ignoring unparsable stored page "${slug}"`)
  }
  return null
}

export function createLocalJobRepository(): JobRepository {
  return {
    async find(slug) {
      const fallback = defaultJobPages[slug]
      if (!fallback) return null
      return readStored(slug) ?? structuredClone(fallback)
    },

    async save(page) {
      const valid = jobPageSchema.parse(page)
      try {
        localStorage.setItem(storageKey(valid.slug), JSON.stringify(valid))
      } catch (error) {
        if (error instanceof DOMException && error.name === 'QuotaExceededError') {
          throw new Error('Espace de stockage plein : utilise des images plus légères.')
        }
        throw error
      }
    }
  }
}
