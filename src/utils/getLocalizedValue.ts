import i18n from 'i18next'

type LocalizeOptions<T> = {
  entity?: T

  // أسماء المفاتيح
  enKey?: keyof T
  arKey?: keyof T

  fallback?: string
}

export function getLocalizedValue<T>({
  entity,
  enKey = 'name' as keyof T,
  arKey = 'nameAr' as keyof T,
  fallback = '-',
}: LocalizeOptions<T>): string {
  if (!entity) return fallback

  const lang = i18n.language || 'en'
  const key = lang.startsWith('ar') ? arKey : enKey

  return String(entity[key] ?? fallback)
}
