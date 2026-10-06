import type { z } from 'zod'
import type {
  assetSchema,
  stickerSchema,
  subjobSchema,
  aboutStatsSchema,
  faqItemSchema,
  proConKindSchema,
  proConSchema,
  tipSchema,
  jobSectionSchema,
  jobPageSchema
} from '../schemas/job'

export type Asset = z.infer<typeof assetSchema>
export type Sticker = z.infer<typeof stickerSchema>
export type Subjob = z.infer<typeof subjobSchema>
export type AboutStats = z.infer<typeof aboutStatsSchema>
export type FaqItem = z.infer<typeof faqItemSchema>
export type ProConKind = z.infer<typeof proConKindSchema>
export type ProCon = z.infer<typeof proConSchema>
export type Tip = z.infer<typeof tipSchema>

export type JobSection = z.infer<typeof jobSectionSchema>
export type JobPage = z.infer<typeof jobPageSchema>

export type SectionType = JobSection['type']
export type SectionOf<T extends SectionType> = Extract<JobSection, { type: T }>

/** Sections holding an ordered, editable list of items. */
export type ListSection = Extract<JobSection, { items: readonly unknown[] }>
export type ItemOf<S extends ListSection> = S['items'][number]

export type JobPageMeta = Pick<JobPage, 'title' | 'tagline'>
