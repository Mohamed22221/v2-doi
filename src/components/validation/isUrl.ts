import * as Yup from 'yup'

export const isUrl = (value: string) =>
    Yup.string().url().isValidSync(value.trim())
