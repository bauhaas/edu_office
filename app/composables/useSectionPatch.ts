import type { JobSection } from '#shared/types/job'

type SectionFields<S extends JobSection> = Partial<Omit<S, 'id' | 'type'>>

/** Shallow, immutable field updates for a section component's `update` event. */
export function useSectionPatch<S extends JobSection>(section: () => S, update: (next: S) => void) {
  return (changes: SectionFields<S>): void => update({ ...section(), ...changes })
}
