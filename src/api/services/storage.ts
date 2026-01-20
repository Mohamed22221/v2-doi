import api from '../api'
import { TUploadPayload, TUploadResponse } from '../types/storage'





const StorageServices = {
    uploadFiles: (payload: TUploadPayload): Promise<TUploadResponse> => {
        const formData = new FormData()
        formData.append('type', payload.type)
        formData.append('fileType', payload.fileType)
        payload.files.forEach((file) => formData.append('files', file))

        return api.post('/storage/uploads', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        })
    },
}

export default StorageServices
