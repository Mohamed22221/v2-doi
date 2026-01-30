import { BaseEntity, LanguageCode, Status } from './common'

export type { LanguageCode }
export type CategoryStatus = Status
export type CategoryLevel = 1 | 2 | 3;

export interface CategoryTranslation {
  languageCode: LanguageCode;
  name: string;
  description?: string;
}

export interface ParentCategory extends BaseEntity {
  parentId: string | null;
  level: CategoryLevel;
  slug: string;
  status: CategoryStatus;
  sortOrder: number;
  image: string | null;
  translations: CategoryTranslation[];
}

export interface ChildCategory extends BaseEntity {
  parentId: string;
  level: CategoryLevel;
  slug: string;
  status: CategoryStatus;
  sortOrder: number;
  image: string | null;
}

export interface Category extends BaseEntity {
  parentId: string | null;
  parent: ParentCategory | null;
  children: ChildCategory[];
  translations: CategoryTranslation[];
  level: CategoryLevel;
  slug: string;
  status: CategoryStatus;
  sortOrder: number;
  image: string | null;
  totalItems: number
}

export type CategoryTableRow = {
  id: string
  slug: string
  translations: CategoryTranslation[]
  status: CategoryStatus
  level: CategoryLevel
  totalItems: number
  children: ChildCategory[]
  image: string | null
  deletedAt: string | null
}
export interface CategoryTranslationPayload {
  languageCode: string
  name: string
  description?: string
}
export interface CategoryPayload {
  translations: CategoryTranslationPayload[]
  parentId?: string | null
  status: CategoryStatus
  sortOrder: number
  image?: string | null

}

// Category tree node type
export interface CategoryTreeNode extends Omit<Category, 'children'> {
  children: CategoryTreeNode[]
}
