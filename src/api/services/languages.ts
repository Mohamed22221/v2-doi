import { TAPIResponseItems, TAPIResponseItem } from '../types/api'
import api from '../api'
import { Language, LanguagePayload } from '../types/languages'

const LanguagesServices = {
    getLanguages: (
        searchParams: string,
    ): Promise<TAPIResponseItems<Language[]>> =>
        api.get(`/admin/languages?${searchParams}`),

    createLanguage: (
        payload: LanguagePayload,
    ): Promise<TAPIResponseItem<Language>> =>
        api.post('/admin/languages', payload),

    getLanguageById: (id: string): Promise<TAPIResponseItem<Language>> =>
        api.get(`/admin/languages/${id}`),

    updateLanguage: (
        id: string,
        payload: LanguagePayload,
    ): Promise<TAPIResponseItem<Language>> =>
        api.put(`/admin/languages/${id}`, payload),

    deleteLanguage: (id: string): Promise<TAPIResponseItem<Language>> =>
        api.delete(`/admin/languages/${id}`),

    hardDeleteLanguage: (id: string): Promise<TAPIResponseItem<Language>> =>
        api.delete(`/admin/languages/${id}/hard`),

    restoreLanguage: (id: string): Promise<TAPIResponseItem<Language>> =>
        api.patch(`/admin/languages/${id}/restore`),

    activateLanguage: (id: string): Promise<TAPIResponseItem<Language>> =>
        api.patch(`/admin/languages/${id}/activate`),

    deactivateLanguage: (id: string): Promise<TAPIResponseItem<Language>> =>
        api.patch(`/admin/languages/${id}/deactivate`),
    
    getInfinityLanguages: (
        page: number,
        limit = 10,
    ): Promise<TAPIResponseItems<Language[]>> =>
        api.get(
            `/admin/languages?page=${page ? page : 1}&limit=${limit}&isActive=${'true'}`,
        ),
}

export default LanguagesServices
