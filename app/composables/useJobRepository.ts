import { createLocalJobRepository, type JobRepository } from '~/repositories/jobRepository'

let repository: JobRepository | undefined

export function useJobRepository(): JobRepository {
  repository ??= createLocalJobRepository()
  return repository
}
