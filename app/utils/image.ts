import { MAX_IMAGE_DATA_URL_LENGTH } from '#shared/schemas/job'
import type { Asset } from '#shared/types/job'

interface ResizeOptions {
  maxSize?: number
  quality?: number
}

export const ACCEPTED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/avif'] as const
const MAX_FILE_BYTES = 10 * 1024 * 1024
const MAX_SOURCE_PIXELS = 40_000_000

/** `file.type` comes from the extension, so the leading bytes are checked too (rejects renamed PDF/SVG/etc.). */
async function hasImageSignature(file: File): Promise<boolean> {
  const bytes = new Uint8Array(await file.slice(0, 12).arrayBuffer())
  const ascii = (start: number, end: number): string => String.fromCharCode(...bytes.slice(start, end))
  return (
    (bytes[0] === 0x89 && ascii(1, 4) === 'PNG') ||
    (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) ||
    ascii(0, 3) === 'GIF' ||
    (ascii(0, 4) === 'RIFF' && ascii(8, 12) === 'WEBP') ||
    (ascii(4, 8) === 'ftyp' && ['avif', 'avis'].includes(ascii(8, 12)))
  )
}

async function decode(file: File): Promise<ImageBitmap> {
  try {
    return await createImageBitmap(file)
  } catch {
    throw new Error('Image illisible ou corrompue.')
  }
}

/** Downscales an uploaded image to a webp data URL small enough to live in localStorage. */
export async function fileToAsset(file: File, alt: string, { maxSize = 800, quality = 0.8 }: ResizeOptions = {}): Promise<Asset> {
  if (!(ACCEPTED_IMAGE_TYPES as readonly string[]).includes(file.type) || !(await hasImageSignature(file))) {
    throw new Error('Format non supporté : PNG, JPEG, WebP, GIF ou AVIF uniquement.')
  }
  if (file.size > MAX_FILE_BYTES) throw new Error('Image trop lourde (10 Mo maximum).')

  const bitmap = await decode(file)
  if (bitmap.width * bitmap.height > MAX_SOURCE_PIXELS) {
    bitmap.close()
    throw new Error('Image trop grande (40 mégapixels maximum).')
  }
  const scale = Math.min(1, maxSize / Math.max(bitmap.width, bitmap.height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(bitmap.width * scale)
  canvas.height = Math.round(bitmap.height * scale)

  const context = canvas.getContext('2d')
  if (!context) throw new Error('Canvas indisponible.')
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  bitmap.close()

  const src = canvas.toDataURL('image/webp', quality)
  if (src.length > MAX_IMAGE_DATA_URL_LENGTH) throw new Error('Image trop lourde après compression.')
  return { src, alt }
}
