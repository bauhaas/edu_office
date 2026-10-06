import type { Component } from 'vue'
import type { SectionType } from '#shared/types/job'
import SubjobsSection from './sections/SubjobsSection.vue'
import AboutSection from './sections/AboutSection.vue'
import FaqSection from './sections/FaqSection.vue'
import ProsConsSection from './sections/ProsConsSection.vue'
import CtaSection from './sections/CtaSection.vue'
import TipsSection from './sections/TipsSection.vue'
import CollageSection from './sections/CollageSection.vue'

/** `plain` sections are white and split by separators; gradient halves blend into each other. */
export type SectionTone = 'plain' | 'gradientTop' | 'gradientBottom'

export interface SectionDefinition {
  component: Component
  label: string
  tone: SectionTone
  /** Edge-to-edge, without section padding. */
  flush?: boolean
}

/** Adding a section type = schema entry + component + one line here (enforced by the Record key). */
export const sectionRegistry: Readonly<Record<SectionType, SectionDefinition>> = {
  subjobs: { component: SubjobsSection, label: 'Métiers', tone: 'plain' },
  about: { component: AboutSection, label: 'À propos', tone: 'plain' },
  faq: { component: FaqSection, label: 'Bon à savoir', tone: 'plain' },
  prosCons: { component: ProsConsSection, label: 'Le métier sans filtre', tone: 'plain' },
  cta: { component: CtaSection, label: 'Appel à l’action', tone: 'plain' },
  tips: { component: TipsSection, label: 'Conseils', tone: 'gradientTop' },
  collage: { component: CollageSection, label: 'Collage & secrets', tone: 'gradientBottom', flush: true }
}
