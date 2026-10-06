const LOCALE = 'fr-FR'

const currency = new Intl.NumberFormat(LOCALE, { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })
const integer = new Intl.NumberFormat(LOCALE, { maximumFractionDigits: 0 })
const compact = new Intl.NumberFormat(LOCALE, { notation: 'compact', compactDisplay: 'long', maximumFractionDigits: 1 })

export const formatEuros = (value: number): string => currency.format(value)
export const formatInteger = (value: number): string => integer.format(value)
/** 1 300 000 -> "1,3 million"; below a million stays exact. */
export const formatLargeCount = (value: number): string =>
  value >= 1_000_000 ? compact.format(value) : integer.format(value)
