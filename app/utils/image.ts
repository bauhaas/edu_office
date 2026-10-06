import type { Asset } from '#shared/types/job'

interface ResizeOptions {
  maxSize?: number
  quality?: number
}

/** Downscales an uploaded image to a webp data URL small enough to live in localStorage. */
export async function fileToAsset(file: File, alt: string, { maxSize = 800, quality = 0.8 }: ResizeOptions = {}): Promise<Asset> {
  if (!file.type.startsWith('image/')) throw new Error('Le fichier doit être une image.')

  const bitmap = await createImageBitmap(file)
  const scale = Math.min(1, maxSize / Math.max(bitmap.width, bitmap.height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(bitmap.width * scale)
  canvas.height = Math.round(bitmap.height * scale)

  const context = canvas.getContext('2d')
  if (!context) throw new Error('Canvas indisponible.')
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  bitmap.close()

  return { src: canvas.toDataURL('image/webp', quality), alt }
}
