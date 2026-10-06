import { z } from 'zod'

export const MAX_SHORT_TEXT = 160
export const MAX_LONG_TEXT = 2000
const MAX_ITEMS = 40
/** ~1.5 MB per image keeps several uploads under the ~5 MB localStorage quota. */
export const MAX_IMAGE_DATA_URL_LENGTH = 1_500_000

const id = z.string().regex(/^[\w-]{1,64}$/, 'Identifiant invalide.')

const optionalText = (max = MAX_SHORT_TEXT) =>
  z.string().trim().max(max, `Texte trop long (${max} caractères max).`)

const requiredText = (label: string, max = MAX_SHORT_TEXT) =>
  optionalText(max).min(1, `${label} est obligatoire.`)

const list = <T extends z.ZodType>(item: T) => z.array(item).max(MAX_ITEMS, `${MAX_ITEMS} éléments maximum.`)

const bounded = (min: number, max: number) => z.number().min(min).max(max)

// Only bundled images or raster data URLs produced by the uploader; no SVG, remote or javascript: sources.
const LOCAL_IMAGE = /^\/images\/[\w-]+\.(png|jpe?g|webp|gif|avif)$/
const DATA_IMAGE = /^data:image\/(png|jpeg|webp|gif|avif);base64,[A-Za-z0-9+/]+=*$/

export const assetSchema = z.object({
  src: z
    .string()
    .max(MAX_IMAGE_DATA_URL_LENGTH, 'Image trop lourde.')
    .refine((src) => LOCAL_IMAGE.test(src) || DATA_IMAGE.test(src), 'Source d’image non autorisée.'),
  alt: optionalText(300)
})

/** Decorative image laid over a box; x/y are the image centre and width, all in % of the box. */
export const stickerSchema = z.object({
  id,
  asset: assetSchema,
  x: bounded(-50, 150),
  y: bounded(-50, 150),
  width: z.number().positive().max(200),
  rotate: bounded(-360, 360)
})

export const subjobSchema = z.object({
  id,
  label: requiredText('Le nom du métier'),
  cover: assetSchema,
  stickers: list(stickerSchema)
})

const count = z.number().int('Nombre entier attendu.').min(0, 'Nombre positif attendu.').max(1_000_000_000)

export const aboutStatsSchema = z.object({
  medianStartingSalary: count,
  openPositions: z.object({
    count,
    year: z.number().int().min(1900, 'Année invalide.').max(2100, 'Année invalide.')
  }),
  professionalsCount: count,
  trainingsCount: count
})

export const faqItemSchema = z.object({
  id,
  question: requiredText('La question'),
  answer: requiredText('La réponse', MAX_LONG_TEXT)
})

export const proConKindSchema = z.enum(['pro', 'con'])

export const proConSchema = z.object({
  id,
  kind: proConKindSchema,
  title: requiredText('Le titre du point'),
  body: optionalText(MAX_LONG_TEXT)
})

export const tipSchema = z.object({
  id,
  icon: z.string().regex(/^[a-z0-9-]+:[a-z0-9-]+$/, 'Icône invalide (format collection:nom).'),
  text: requiredText('Le conseil', MAX_LONG_TEXT)
})

/** Hidden story revealed in a full-screen overlay when its collage piece is tapped. */
export const secretSchema = z.object({
  title: requiredText('Le titre du secret'),
  body: optionalText(MAX_LONG_TEXT),
  /** Shows a pulsing badge on the piece; default keeps older saved drafts valid. */
  showHint: z.boolean().default(false)
})

export const collagePieceSchema = stickerSchema.extend({
  secret: secretSchema.nullable()
})

export const subjobsSectionSchema = z.object({
  id,
  type: z.literal('subjobs'),
  items: list(subjobSchema)
})

// Section titles are optional: an empty one is simply not rendered.
export const aboutSectionSchema = z.object({
  id,
  type: z.literal('about'),
  title: optionalText(),
  body: optionalText(MAX_LONG_TEXT),
  stats: aboutStatsSchema
})

export const faqSectionSchema = z.object({
  id,
  type: z.literal('faq'),
  title: optionalText(),
  items: list(faqItemSchema)
})

export const prosConsSectionSchema = z.object({
  id,
  type: z.literal('prosCons'),
  title: optionalText(),
  items: list(proConSchema)
})

export const ctaSectionSchema = z.object({
  id,
  type: z.literal('cta'),
  title: requiredText('Le titre de l’appel à l’action'),
  subtitle: optionalText(),
  buttonLabel: requiredText('Le libellé du bouton', 60),
  href: z.url({ protocol: /^https?$/, error: 'Le lien doit commencer par http(s)://' }).max(2048)
})

export const tipsSectionSchema = z.object({
  id,
  type: z.literal('tips'),
  title: optionalText(),
  items: list(tipSchema)
})

/** Pieces render in array order: later items sit on top. */
export const collageSectionSchema = z.object({
  id,
  type: z.literal('collage'),
  items: list(collagePieceSchema)
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
  slug: z.string().regex(/^[a-z0-9-]{1,64}$/),
  title: requiredText('Le titre de la page', 80),
  tagline: requiredText('Le sous-titre de la page', 200),
  sections: z.array(jobSectionSchema).max(20)
})
