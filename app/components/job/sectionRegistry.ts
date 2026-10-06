import type { Component } from 'vue'
import type { JobSection, SectionOf, SectionType } from '#shared/types/job'
import SubjobsSection from './sections/SubjobsSection.vue'
import AboutSection from './sections/AboutSection.vue'
import FaqSection from './sections/FaqSection.vue'
import ProsConsSection from './sections/ProsConsSection.vue'
import CtaSection from './sections/CtaSection.vue'
import TipsSection from './sections/TipsSection.vue'
import CollageSection from './sections/CollageSection.vue'

/** `plain` sections are white and split by separators; gradient halves blend into each other. */
export type SectionTone = 'plain' | 'gradientTop' | 'gradientBottom'

export interface SectionDefinition<T extends SectionType = SectionType> {
  component: Component
  label: string
  tone: SectionTone
  /** Edge-to-edge, without section padding. */
  flush?: boolean
  /** Empty sections are hidden on the public page (still shown in edit mode to add content). */
  isEmpty?: (section: SectionOf<T>) => boolean
}

const hasNoItems = (section: { items: readonly unknown[] }): boolean => section.items.length === 0

/** Adding a section type = schema entry + component + one line here (enforced by the mapped key). */
export const sectionRegistry: Readonly<{ [T in SectionType]: SectionDefinition<T> }> = {
  subjobs: { component: SubjobsSection, label: 'Métiers', tone: 'plain', isEmpty: hasNoItems },
  about: { component: AboutSection, label: 'À propos', tone: 'plain' },
  faq: { component: FaqSection, label: 'Bon à savoir', tone: 'plain', isEmpty: hasNoItems },
  prosCons: { component: ProsConsSection, label: 'Le métier sans filtre', tone: 'plain', isEmpty: hasNoItems },
  cta: { component: CtaSection, label: 'Appel à l’action', tone: 'plain' },
  tips: { component: TipsSection, label: 'Conseils', tone: 'gradientTop', isEmpty: hasNoItems },
  collage: { component: CollageSection, label: 'Collage & secrets', tone: 'gradientBottom', flush: true, isEmpty: hasNoItems }
}

export function definitionOf(section: JobSection): SectionDefinition {
  return sectionRegistry[section.type] as SectionDefinition
}

export function isSectionEmpty(section: JobSection): boolean {
  const { isEmpty } = sectionRegistry[section.type] as { isEmpty?: (section: JobSection) => boolean }
  return isEmpty?.(section) ?? false
}
