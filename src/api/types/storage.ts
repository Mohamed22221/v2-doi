export type TUploadPayload = {
    type: string
    fileType: 'image' | 'file'
    files: File[]
}

export type TUploadResponse = {
    statusCode: number
    success: boolean
    message: string
    data: {
        urls: string[]
        count: number
        fileType: string
        type: string
    }
}