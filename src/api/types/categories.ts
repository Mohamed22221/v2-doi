export type LanguageCode = 'en' | 'ar';
export type CategoryStatus = 'active' | 'inactive';
export type CategoryLevel = 1 | 2 | 3;

export interface CategoryTranslation {
  languageCode: LanguageCode;
  name: string;
  description?: string;
}

export interface BaseEntity {
  id: string;
  createdAt: string;   // ISO Date
  updatedAt: string;   // ISO Date
  deletedAt: string | null;
}

export interface ParentCategory extends BaseEntity {
  parentId: string | null;
  level: CategoryLevel;
  slug: string;
  status: CategoryStatus;
  sortOrder: number;
  image: string | null;
}

export interface ChildCategory extends BaseEntity {
  parentId: string;
  level: CategoryLevel;
  slug: string;
  status: CategoryStatus;
  sortOrder: number;
  image: string | null;
}

export interface Category extends BaseEntity{
  parentId: string | null;
  parent: ParentCategory | null;
  children: ChildCategory[];
  translations: CategoryTranslation[];
  level: CategoryLevel;
  slug: string;
  status: CategoryStatus;
  sortOrder: number;
  image: string | null;
  itemsCount : number
}

export type CategoryTableRow = {
  id: string
  slug: string
  translations: CategoryTranslation[]     
  status: CategoryStatus
  itemsCount: number                     
  children: ChildCategory[]              
  image: string | null
}

export interface CategoryPayload {
    translations: CategoryTranslation[]
    parentId?: string | null
    status: CategoryStatus
    sortOrder: number
    image?: string | null
}

// Category tree node type
export interface CategoryTreeNode extends Omit<Category, 'children'> {
    children: CategoryTreeNode[]
}
