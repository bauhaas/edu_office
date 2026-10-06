import type { JobPage } from '#shared/types/job'
import { hotellerie } from './hotellerie'

export const defaultJobPages: Readonly<Record<string, JobPage>> = {
  [hotellerie.slug]: hotellerie
}
