import { useMutation } from '@tanstack/react-query'
import StorageServices from '../services/storage'
import { TUploadPayload } from '../types/storage'

export const useUploadFiles = () => {
    return useMutation({
        mutationFn: (payload: TUploadPayload) =>
            StorageServices.uploadFiles(payload),
    })
}
