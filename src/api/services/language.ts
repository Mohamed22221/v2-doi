import { TAPIResponseItems } from '../types/api'
import api from '../api'
import { Language } from '../types/languages'

// Payload type for creating/updating categories

const LanguageServices = {
    getInfinityLanguages: (
        page: number,
        limit = 10,
    ): Promise<TAPIResponseItems<Language[]>> =>
        api.get(
            `/admin/languages?page=${page ? page : 1}&limit=${limit}`,
        ),
}

export default LanguageServices
