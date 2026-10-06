import type { FaqItem, ProCon, ProConKind, Subjob, Tip } from '#shared/types/job'

export const createFaqItem = (): FaqItem => ({ id: createId(), question: 'Nouvelle question ?', answer: 'Réponse…' })

export const createProCon = (kind: ProConKind): ProCon => ({
  id: createId(),
  kind,
  title: kind === 'pro' ? 'Nouveau point fort' : 'Nouveau point faible',
  body: 'Description…'
})

export const createSubjob = (): Subjob => ({
  id: createId(),
  label: 'Nouveau métier',
  cover: { src: '/images/cover-service.jpg', alt: '' },
  stickers: []
})

export const createTip = (): Tip => ({ id: createId(), emoji: '💡', text: 'Nouveau conseil…' })
