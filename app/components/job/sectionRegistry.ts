import type { Component } from 'vue'
import type { SectionType } from '#shared/types/job'
import SubjobsSection from './sections/SubjobsSection.vue'
import AboutSection from './sections/AboutSection.vue'
import FaqSection from './sections/FaqSection.vue'
import ProsConsSection from './sections/ProsConsSection.vue'
import CtaSection from './sections/CtaSection.vue'
import TipsSection from './sections/TipsSection.vue'

export type SectionTone = 'card' | 'gradient'

export interface SectionDefinition {
  component: Component
  label: string
  tone: SectionTone
}

/** Adding a section type = schema entry + component + one line here (enforced by the Record key). */
export const sectionRegistry: Readonly<Record<SectionType, SectionDefinition>> = {
  subjobs: { component: SubjobsSection, label: 'Métiers', tone: 'card' },
  about: { component: AboutSection, label: 'À propos', tone: 'card' },
  faq: { component: FaqSection, label: 'Bon à savoir', tone: 'card' },
  prosCons: { component: ProsConsSection, label: 'Le métier sans filtre', tone: 'card' },
  cta: { component: CtaSection, label: 'Appel à l’action', tone: 'card' },
  tips: { component: TipsSection, label: 'Conseils', tone: 'gradient' }
}
