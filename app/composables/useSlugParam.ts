export function useSlugParam(): string {
  const { slug } = useRoute().params
  if (typeof slug !== 'string' || slug.length === 0) {
    throw createError({ statusCode: 404, message: 'Métier introuvable', fatal: true })
  }
  return slug
}
