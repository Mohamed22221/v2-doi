import * as Yup from 'yup'

export const isEmail = (value: string) =>
  Yup.string().email().isValidSync(value.trim())