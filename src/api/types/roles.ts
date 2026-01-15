// Permission item
export interface Permission {
  id: number
  name: string
}

// Main Role / Type entity
export interface Role {
  id: number
  name: string
  description: string
  isDefault: boolean
  priority: number
  createdAt: string 
  updatedAt: string 
  permissions: Permission[]
}
