import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Field, FieldProps } from 'formik'
import { HiEye, HiTrash } from 'react-icons/hi'
import Dialog from '@/components/ui/Dialog'
import Upload from '@/components/ui/Upload'
import { Notification, Spinner, toast } from '@/components/ui'
import { useUploadFiles } from '@/api/hooks/storage'

type ImageItem = {
    name: string
    url: string
}

type Props = {
    name?: string
    uploadType?: string
}

const CategoryImageUpload = ({
    name = 'image',
    uploadType = 'category',
}: Props) => {
    const { t } = useTranslation()
    const [selectedImg, setSelectedImg] = useState<ImageItem | null>(null)
    const [viewOpen, setViewOpen] = useState(false)

    const { mutateAsync: uploadFiles, isPending: isUploading } =
        useUploadFiles()

    const onViewOpen = (img: ImageItem) => {
        setSelectedImg(img)
        setViewOpen(true)
    }

    const onDialogClose = () => {
        setViewOpen(false)
        setTimeout(() => setSelectedImg(null), 300)
    }

    const beforeUpload = (fileList: FileList | null) => {
        if (!fileList || fileList.length === 0) return false

        if (fileList.length > 1) return t('categories.upload.oneOnly')

        const file = fileList[0]
        const allowedFileType = ['image/jpeg', 'image/png', 'image/webp']
        const maxFileSize = 5 * 1024 * 1024

        if (!allowedFileType.includes(file.type))
            return t('categories.upload.invalidType')
        if (file.size > maxFileSize) return t('categories.upload.tooLarge')

        return true
    }

    return (
        <Field asterisk name={name}>
            {({ field, form, meta }: FieldProps<string>) => {
                const invalid = Boolean(meta.touched && meta.error)
                const errorMessage = meta.error
                const hasImage = Boolean(field.value)

                const current: ImageItem | null = hasImage
                    ? {
                          name: t('categories.coverImage'),
                          url: field.value,
                      }
                    : null

                const handleUpload = async (files: File[]) => {
                    const file = files[0]
                    if (!file) return

                    try {
                        const res = await uploadFiles({
                            type: uploadType,
                            fileType: 'image',
                            files: [file],
                        })

                        const url = res.data.urls[0]
                        if (!url) {
                            throw new Error(t('categories.upload.noUrl'))
                        }

                        form.setFieldValue(field.name, url)
                        form.setFieldTouched(field.name, true, false)

                        toast.push(
                            <Notification type="success">
                                {t('categories.upload.success')}
                            </Notification>,
                        )
                    } catch {
                        toast.push(
                            <Notification type="danger">
                                {t('categories.upload.failed')}
                            </Notification>,
                        )
                    }
                }

                const handleDelete = () => {
                    form.setFieldValue(field.name, '')
                    form.setFieldTouched(field.name, true, false)
                    setSelectedImg(null)
                }

                return (
                    <>
                        {current?.url ? (
                            // Preview Mode
                            <div className="relative group rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 w-full h-[200px]">
                                <img
                                    src={current.url}
                                    alt={current.name}
                                    className="absolute inset-0 w-full h-full object-cover"
                                    crossOrigin="anonymous"
                                />

                                {/* Hover actions */}
                                <div className="absolute inset-0 bg-gray-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    <button
                                        type="button"
                                        className="p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            onViewOpen(current)
                                        }}
                                        aria-label="view"
                                    >
                                        <HiEye className="text-xl" />
                                    </button>

                                    <button
                                        type="button"
                                        className="p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            handleDelete()
                                        }}
                                        aria-label="delete"
                                    >
                                        <HiTrash className="text-xl" />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            // Upload Mode
                            <Upload
                                draggable
                                multiple={false}
                                uploadLimit={1}
                                beforeUpload={beforeUpload}
                                showList={false}
                                disabled={isUploading}
                                accept="image/jpeg,image/png,image/webp"
                                onChange={handleUpload}
                            >
                                {isUploading && (
                                    <div className="absolute inset-0 bg-white/70 dark:bg-gray-900/60 flex items-center justify-center z-10">
                                        <Spinner />
                                    </div>
                                )}
                                <div
                                    className={[
                                        '   cursor-pointer dark:hover:border-gray-500 transition-colors',
                                        isUploading
                                            ? 'opacity-60 pointer-events-none'
                                            : 'border-gray-300 dark:border-gray-600',
                                    ].join(' ')}
                                >
                                    <div className="my-10 text-center w-fit ">
                                        <div className="text-6xl mb-4 flex justify-center">
                                            {/* <FcImageFile /> */}
                                        </div>
                                        <p className="font-semibold">
                                            <span className="text-gray-800 dark:text-white">
                                                {t('common.dropImage')}{' '}
                                            </span>
                                            <span className="text-blue-500">
                                                {t('common.browse')}
                                            </span>
                                        </p>

                                        <p className="mt-1 opacity-60 dark:text-white">
                                            {t('common.supportFormats')}
                                        </p>
                                    </div>
                                </div>
                            </Upload>
                        )}

                        {/* Error message */}
                        {invalid && (
                            <div className="text-xs text-red-500 mt-2">
                                {errorMessage}
                            </div>
                        )}

                        {/* View Dialog */}
                        <Dialog
                            isOpen={viewOpen}
                            onClose={onDialogClose}
                            onRequestClose={onDialogClose}
                        >
                            <h5 className="mb-4">{selectedImg?.name}</h5>
                            {selectedImg?.url && (
                                <img
                                    className="w-full"
                                    src={selectedImg.url}
                                    alt={selectedImg.name}
                                    crossOrigin="anonymous"
                                />
                            )}
                        </Dialog>
                    </>
                )
            }}
        </Field>
    )
}

export default CategoryImageUpload
