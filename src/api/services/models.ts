import { TAPIResponseItems, TAPIResponseItem } from '../types/api'
import api from '../api'
import { Model, ModelPayload } from '../types/models'

const ModelsServices = {
    getModels: (
        searchParams: string,
    ): Promise<TAPIResponseItems<Model[]>> =>
        api.get(`/admin/models?${searchParams}`),

    createModel: (
        payload: ModelPayload,
    ): Promise<TAPIResponseItem<Model>> =>
        api.post('/admin/models', payload),

    getModelById: (id: string): Promise<TAPIResponseItem<Model>> =>
        api.get(`/admin/models/${id}`),

    updateModel: (
        id: string,
        payload: ModelPayload,
    ): Promise<TAPIResponseItem<Model>> =>
        api.put(`/admin/models/${id}`, payload),

    deleteModel: (id: string): Promise<TAPIResponseItem<Model>> =>
        api.delete(`/admin/models/${id}`),

    hardDeleteModel: (id: string): Promise<TAPIResponseItem<Model>> =>
        api.delete(`/admin/models/${id}/hard`),

    restoreModel: (id: string): Promise<TAPIResponseItem<Model>> =>
        api.patch(`/admin/models/${id}/restore`),

    getInfinityModels: (
        page: number,
        limit: number = 10,
    ): Promise<TAPIResponseItems<Model[]>> =>
        api.get(`/admin/models?page=${page}&limit=${limit}`),
}

export default ModelsServices
