import { TAPIResponseItems } from '../types/api'
import api from '../api'
import { Category } from '../types/categories'

const CategoriesServices = {
    getAllCategories: (
        searchParams: string,
    ): Promise<TAPIResponseItems<Category[]>> =>
        api.get(`/admin/categories?${searchParams}`),
}

export default CategoriesServices
