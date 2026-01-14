export const phoneRegex = /^\+[1-9]\d{7,14}$/

export const normalizePhone = (value: string) =>
    value.replace(/[\s-]/g, '').trim()

export const isPhone = (value: string) => phoneRegex.test(normalizePhone(value))
