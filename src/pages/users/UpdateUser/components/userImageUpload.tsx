import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import AdaptableCard from '@/components/shared/AdaptableCard'
import Dialog from '@/components/ui/Dialog'
import Upload from '@/components/ui/Upload'
import { FormItem } from '@/components/ui/Form'
import { HiEye, HiTrash, HiOutlineUpload } from 'react-icons/hi'
import { Field, FieldProps } from 'formik'
import { Notification, Spinner, toast } from '@/components/ui'
import { useUploadFiles } from '@/api/hooks/storage'
import type { TUserPayload } from '@/api/types/users'

type ImageItem = {
    name: string
    url: string
}

type Props = {
    name?: keyof TUserPayload // default: "image"
    title?: string
    subtitle?: string
    uploadType?: string // default: "product"
    size?: number // avatar size px (default 96)
}

const UserImageUpload = ({
    name = 'image',
    title,
    subtitle,
    uploadType = 'product',
    size = 96,
}: Props) => {
    const { t } = useTranslation()
    const [selectedImg, setSelectedImg] = useState<ImageItem | null>(null)
    const [viewOpen, setViewOpen] = useState(false)
    const [, setDeleteConfirmationOpen] = useState(false)

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

        if (fileList.length > 1) return t('users.upload.oneOnly')

        const file = fileList[0]
        const allowedFileType = ['image/jpeg', 'image/png', 'image/webp']
        const maxFileSize = 5 * 1024 * 1024

        if (!allowedFileType.includes(file.type))
            return t('users.upload.invalidType')
        if (file.size > maxFileSize) return t('users.upload.tooLarge')

        return true
    }

    return (
        <AdaptableCard className="mb-4 bg-transparent">
            <h5>{title ?? t('users.img')}</h5>
            <p className="mb-6">{subtitle ?? t('users.imgSubtitle')}</p>

            <FormItem>
                <Field name={name}>
                    {({ field, form, meta }: FieldProps<string>) => {
                        const invalid = Boolean(meta.touched && meta.error)
                        const errorMessage = meta.error
                        const hasImage = Boolean(field.value)

                        const current: ImageItem | null = hasImage
                            ? { name: t('users.img'), url: field.value }
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
                                    throw new Error(t('users.upload.noUrl'))
                                }

                                form.setFieldValue(field.name, url)
                                form.setFieldTouched(field.name, true, false)

                                toast.push(
                                    <Notification type="success">
                                        {t('users.upload.success')}
                                    </Notification>,
                                )
                            } catch {
                                toast.push(
                                    <Notification type="danger">
                                        {t('users.upload.failed')}
                                    </Notification>,
                                )
                            }
                        }

                        const handleDelete = () => {
                            form.setFieldValue(field.name, '')
                            form.setFieldTouched(field.name, true, false)
                            setDeleteConfirmationOpen(false)
                            setSelectedImg(null)
                        }

                        return (
                            <>
                                {/* ✅ Avatar is the Upload area */}
                                <Upload
                                    draggable={false}
                                    multiple={false}
                                    uploadLimit={1}
                                    beforeUpload={beforeUpload}
                                    showList={false}
                                    disabled={isUploading}
                                    onChange={handleUpload}
                                >
                                    {isUploading && (
                                        <div className="absolute inset-0 bg-white/70 dark:bg-gray-900/60 flex items-center justify-center">
                                            <Spinner />
                                        </div>
                                    )}
                                    <div
                                        className={[
                                            'group relative shrink-0 rounded-full border overflow-hidden bg-gray-50 cursor-pointer',
                                            isUploading
                                                ? 'opacity-60 pointer-events-none'
                                                : '',
                                        ].join(' ')}
                                        style={{ width: size, height: size }}
                                        role="button"
                                        aria-label={t('users.upload.choose')}
                                    >
                                        {current?.url ? (
                                            <>
                                                <img
                                                    src={current.url}
                                                    alt={current.name}
                                                    className="h-full w-full object-cover"
                                                />

                                                {/* Hover actions */}
                                                <div className="absolute inset-0 bg-gray-900/60 hidden group-hover:flex items-center justify-center gap-2">
                                                    <button
                                                        type="button"
                                                        className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20"
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            onViewOpen(current)
                                                        }}
                                                        aria-label="view"
                                                    >
                                                        <HiEye className="text-lg" />
                                                    </button>

                                                    <button
                                                        type="button"
                                                        className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20"
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            handleDelete()
                                                        }}
                                                        aria-label="delete"
                                                    >
                                                        <HiTrash className="text-lg" />
                                                    </button>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="h-full w-full flex flex-col items-center justify-center text-xs text-gray-500 gap-1">
                                                <HiOutlineUpload className="text-lg" />
                                                <span className="text-center px-2">
                                                    {t('users.upload.choose')}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </Upload>

                                {/* Helper text */}
                                <div className="mt-2 text-xs text-gray-500">
                                    {t('users.upload.support')}
                                </div>

                                {/* Error message */}
                                <div
                                    className={[
                                        'form-explain overflow-hidden transition-all duration-150 ease-out',
                                        invalid
                                            ? 'opacity-100 translate-y-0 max-h-20'
                                            : 'opacity-0 -translate-y-1 max-h-0 pointer-events-none',
                                    ].join(' ')}
                                    aria-hidden={!invalid}
                                >
                                    {errorMessage}
                                </div>

                                {/* dialogs */}
                                <Dialog
                                    isOpen={viewOpen}
                                    onClose={onDialogClose}
                                    onRequestClose={onDialogClose}
                                >
                                    <h5 className="mb-4">
                                        {selectedImg?.name}
                                    </h5>
                                    {selectedImg?.url && (
                                        <img
                                            className="w-full"
                                            src={selectedImg.url}
                                            alt={selectedImg.name}
                                        />
                                    )}
                                </Dialog>
                                {/* 
                                <ConfirmDialog
                                    isOpen={deleteConfirmationOpen}
                                    type="danger"
                                    title={t('users.upload.removeTitle')}
                                    confirmButtonColor="red-600"
                                    onClose={onDeleteConfirmationClose}
                                    onRequestClose={onDeleteConfirmationClose}
                                    onCancel={onDeleteConfirmationClose}
                                    onConfirm={handleDelete}
                                >
                                    <p>{t('users.upload.removeConfirm')}</p>
                                </ConfirmDialog> */}
                            </>
                        )
                    }}
                </Field>
            </FormItem>
        </AdaptableCard>
    )
}

export default UserImageUpload
