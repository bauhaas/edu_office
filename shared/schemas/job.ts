import { z } from 'zod'

const id = z.string().min(1)

export const assetSchema = z.object({
  src: z.string().min(1),
  alt: z.string()
})

/** Decorative image laid over a box; x/y are the image centre and width, all in % of the box. */
export const stickerSchema = z.object({
  id,
  asset: assetSchema,
  x: z.number(),
  y: z.number(),
  width: z.number().positive(),
  rotate: z.number()
})

export const subjobSchema = z.object({
  id,
  label: z.string(),
  cover: assetSchema,
  stickers: z.array(stickerSchema)
})

export const aboutStatsSchema = z.object({
  medianStartingSalary: z.number().nonnegative(),
  openPositions: z.object({
    count: z.number().int().nonnegative(),
    year: z.number().int()
  }),
  professionalsCount: z.number().int().nonnegative(),
  trainingsCount: z.number().int().nonnegative()
})

export const faqItemSchema = z.object({
  id,
  question: z.string(),
  answer: z.string()
})

export const proConKindSchema = z.enum(['pro', 'con'])

export const proConSchema = z.object({
  id,
  kind: proConKindSchema,
  title: z.string(),
  body: z.string()
})

export const tipSchema = z.object({
  id,
  icon: z.string(),
  text: z.string()
})

/** Hidden story revealed in a full-screen overlay when its collage piece is tapped. */
export const secretSchema = z.object({
  title: z.string(),
  body: z.string(),
  /** Shows a pulsing badge on the piece; default keeps older saved drafts valid. */
  showHint: z.boolean().default(false)
})

export const collagePieceSchema = stickerSchema.extend({
  secret: secretSchema.nullable()
})

export const subjobsSectionSchema = z.object({
  id,
  type: z.literal('subjobs'),
  items: z.array(subjobSchema)
})

export const aboutSectionSchema = z.object({
  id,
  type: z.literal('about'),
  title: z.string(),
  body: z.string(),
  stats: aboutStatsSchema
})

export const faqSectionSchema = z.object({
  id,
  type: z.literal('faq'),
  title: z.string(),
  items: z.array(faqItemSchema)
})

export const prosConsSectionSchema = z.object({
  id,
  type: z.literal('prosCons'),
  title: z.string(),
  items: z.array(proConSchema)
})

export const ctaSectionSchema = z.object({
  id,
  type: z.literal('cta'),
  title: z.string(),
  subtitle: z.string(),
  buttonLabel: z.string(),
  href: z.url({ protocol: /^https?$/, error: 'Le lien doit commencer par http(s)://' })
})

export const tipsSectionSchema = z.object({
  id,
  type: z.literal('tips'),
  title: z.string(),
  items: z.array(tipSchema)
})

/** Pieces render in array order: later items sit on top. */
export const collageSectionSchema = z.object({
  id,
  type: z.literal('collage'),
  items: z.array(collagePieceSchema)
})

export const jobSectionSchema = z.discriminatedUnion('type', [
  subjobsSectionSchema,
  aboutSectionSchema,
  faqSectionSchema,
  prosConsSectionSchema,
  ctaSectionSchema,
  tipsSectionSchema,
  collageSectionSchema
])

export const jobPageSchema = z.object({
  slug: z.string().min(1),
  title: z.string(),
  tagline: z.string(),
  sections: z.array(jobSectionSchema)
})
