import { TAPIResponseItems, TAPIResponseItem } from '../types/api'
import api from '../api'
import { Category, CategoryPayload, CategoryTreeNode } from '../types/categories'


// Payload type for creating/updating categories

const CategoriesServices = {
    getAllCategories: (
        searchParams: string,
    ): Promise<TAPIResponseItems<Category[]>> =>
        api.get(`/admin/categories?${searchParams}`),

    createCategory: (
        payload: CategoryPayload,
    ): Promise<TAPIResponseItem<Category>> =>
        api.post('/admin/categories', payload),

    getCategoryById: (id: string): Promise<TAPIResponseItem<Category>> =>
        api.get(`/admin/categories/${id}`),

    updateCategory: (
        id: string,
        payload: CategoryPayload,
    ): Promise<TAPIResponseItem<Category>> =>
        api.put(`/admin/categories/${id}`, payload),

    softDeleteCategory: (id: string): Promise<TAPIResponseItem<Category>> =>
        api.delete(`/admin/categories/${id}`),

    hardDeleteCategory: (id: string): Promise<TAPIResponseItem<Category>> =>
        api.delete(`/admin/categories/${id}/hard`),

    restoreCategory: (id: string): Promise<TAPIResponseItem<Category>> =>
        api.patch(`/admin/categories/${id}/restore`),

    activateCategory: (id: string): Promise<TAPIResponseItem<Category>> =>
        api.patch(`/admin/categories/${id}/activate`),

    deactivateCategory: (id: string): Promise<TAPIResponseItem<Category>> =>
        api.patch(`/admin/categories/${id}/deactivate`),

    getCategoriesTree: (): Promise<TAPIResponseItem<CategoryTreeNode[]>> =>
        api.get('/admin/categories/tree'),
}

export default CategoriesServices
