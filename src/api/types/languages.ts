import { BaseEntity } from './common'

export interface Language extends Omit<BaseEntity, 'id'> {
  id: number
  code: string
  name: string
  isActive: boolean
}

export interface LanguagePayload {
  code: string
  name: string
  isActive: boolean
}