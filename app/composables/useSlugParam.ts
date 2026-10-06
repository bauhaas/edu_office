export function useSlugParam(): string {
  const { slug } = useRoute().params
  if (typeof slug !== 'string' || slug.length === 0) throw jobNotFoundError()
  return slug
}

export const jobNotFoundError = () => createError({ statusCode: 404, message: 'Métier introuvable', fatal: true })
