import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Field, FieldProps, FormikProps } from 'formik'
import { HiEye, HiTrash, HiOutlineUpload } from 'react-icons/hi'
import Cropper, { Area } from 'react-easy-crop'
import Dialog from '@/components/ui/Dialog'
import Upload from '@/components/ui/Upload'
import { Notification, Spinner, toast, Button } from '@/components/ui'
import { useUploadFiles } from '@/api/hooks/storage'
import AdaptableCard from '@/components/shared/AdaptableCard'
import getCroppedImg from '@/utils/cropImage'

type ImageItem = {
    name: string
    url: string
}

type Props = {
    name: string
    uploadType: string
    variant?: 'box' | 'avatar'
    label?: string
    description?: string
    placeholder?: string
    size?: number
    maxSize?: number
    allowedTypes?: string[]
    successMessage?: string
    failureMessage?: string
    tPrefix?: string
    crop?: boolean
    aspectRatio?: number
}

const ImageUpload = (props: Props) => {
    const {
        name,
        uploadType,
        variant = 'box',
        label,
        description,
        placeholder,
        size = 120,
        maxSize = 5 * 1024 * 1024,
        allowedTypes = ['image/jpeg', 'image/png', 'image/webp'],
        successMessage,
        failureMessage,
        tPrefix,
        crop = false,
        aspectRatio = 1,
    } = props

    const { t } = useTranslation()
    const [selectedImg, setSelectedImg] = useState<ImageItem | null>(null)
    const [viewOpen, setViewOpen] = useState(false)
    const [cropOpen, setCropOpen] = useState(false)
    const [tempFile, setTempFile] = useState<File | null>(null)
    const [cropUrl, setCropUrl] = useState<string>('')
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
    const [cropLoading, setCropLoading] = useState(false)
    const [cropState, setCropState] = useState({ x: 0, y: 0 })
    const [zoomState, setZoomState] = useState(1)

    const { mutateAsync: uploadFiles, isPending: isUploading } = useUploadFiles()

    const onCropComplete = useCallback((_croppedArea: Area, croppedAreaPixels: Area) => {
        setCroppedAreaPixels(croppedAreaPixels)
    }, [])

    const handleCropConfirm = async (form: FormikProps<Record<string, string>>, fieldName: string) => {
        if (!croppedAreaPixels || !cropUrl) return

        setCropLoading(true)
        try {
            const croppedImageBlob = await getCroppedImg(cropUrl, croppedAreaPixels)
            if (croppedImageBlob) {
                const file = new File([croppedImageBlob], tempFile?.name || 'temp.jpg', {
                    type: 'image/jpeg',
                })

                const res = await uploadFiles({
                    type: uploadType,
                    fileType: 'image',
                    files: [file],
                })

                const url = res.data.urls[0]
                if (!url) throw new Error()

                form.setFieldValue(fieldName, url)
                form.setFieldTouched(fieldName, true, false)

                toast.push(
                    <Notification type="success">
                        {successMessage || (tPrefix ? t(`${tPrefix}.upload.success`) : t('common.success'))}
                    </Notification>
                )
                setCropOpen(false)
            }
        } catch (error) {
            toast.push(
                <Notification type="danger">
                    {failureMessage || (tPrefix ? t(`${tPrefix}.upload.failed`) : t('common.failed'))}
                </Notification>
            )
        } finally {
            setCropLoading(false)
            setTempFile(null)
            setCropUrl('')
        }
    }

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
        if (fileList.length > 1) return tPrefix ? t(`${tPrefix}.upload.oneOnly`) : t('common.upload.oneOnly')

        const file = fileList[0]
        if (!allowedTypes.includes(file.type))
            return tPrefix ? t(`${tPrefix}.upload.invalidType`) : t('common.upload.invalidType')
        if (file.size > maxSize) return tPrefix ? t(`${tPrefix}.upload.tooLarge`) : t('common.upload.tooLarge')

        return true
    }

    const renderContent = (field: FieldProps['field'], form: FormikProps<Record<string, string>>, meta: FieldProps['meta']) => {
        const invalid = Boolean(meta.touched && meta.error)
        const errorMessage = meta.error
        const hasImage = Boolean(field.value)
        const current: ImageItem | null = hasImage
            ? { name: label || t('common.image'), url: field.value }
            : null

        const handleUpload = async (files: File[]) => {
            const file = files[0]
            if (!file) return

            if (crop) {
                setTempFile(file)
                setCropUrl(URL.createObjectURL(file))
                setCropState({ x: 0, y: 0 })
                setZoomState(1)
                setCropOpen(true)
                return
            }

            try {
                const res = await uploadFiles({
                    type: uploadType,
                    fileType: 'image',
                    files: [file],
                })

                const url = res.data.urls[0]
                if (!url) throw new Error()

                form.setFieldValue(field.name, url)
                form.setFieldTouched(field.name, true, false)

                toast.push(
                    <Notification type="success">
                        {successMessage || (tPrefix ? t(`${tPrefix}.upload.success`) : t('common.success'))}
                    </Notification>
                )
            } catch {
                toast.push(
                    <Notification type="danger">
                        {failureMessage || (tPrefix ? t(`${tPrefix}.upload.failed`) : t('common.failed'))}
                    </Notification>
                )
            }
        }

        const handleDelete = () => {
            form.setFieldValue(field.name, '')
            form.setFieldTouched(field.name, true, false)
        }

        if (variant === 'avatar') {
            return (
                <AdaptableCard className="mb-4 bg-transparent border-none shadow-none">
                    <div className="flex gap-1 items-center">
                        <span className="text-red-500 ltr:mr-1 rtl:ml-1 mx-2">*</span>
                        <h5>{label || t('common.image')}</h5>
                    </div>
                    {description && <p className="mb-6">{description}</p>}
                    <div className="relative">
                        <Upload
                            draggable={false}
                            multiple={false}
                            uploadLimit={1}
                            beforeUpload={beforeUpload}
                            showList={false}
                            disabled={isUploading || cropLoading}
                            accept={allowedTypes.join(',')}
                            onChange={handleUpload}
                        >
                            <div
                                className={[
                                    'group relative shrink-0 rounded-full border overflow-hidden bg-gray-50 cursor-pointer',
                                    (isUploading || cropLoading) ? 'opacity-60 pointer-events-none' : '',
                                ].join(' ')}
                                style={{ width: size, height: size }}
                            >
                                {isUploading || cropLoading ? (
                                    <div className="absolute inset-0 bg-white/70 dark:bg-gray-900/60 flex items-center justify-center z-10">
                                        <Spinner />
                                    </div>
                                ) : null}
                                {current?.url ? (
                                    <>
                                        <img
                                            src={current.url}
                                            alt={current.name}
                                            className="h-full w-full object-cover"
                                            crossOrigin="anonymous"
                                        />
                                        <div className="absolute inset-0 bg-gray-900/60 hidden group-hover:flex items-center justify-center gap-2">
                                            <button
                                                type="button"
                                                className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20"
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    onViewOpen(current)
                                                }}
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
                                            >
                                                <HiTrash className="text-lg" />
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <div className="h-full w-full flex flex-col items-center justify-center text-xs text-gray-500 gap-1">
                                        <HiOutlineUpload className="text-lg" />
                                        <span className="text-center px-2">
                                            {placeholder || t('common.browse')}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </Upload>
                        {invalid && <div className="text-xs text-red-500 mt-2">{errorMessage}</div>}
                    </div>
                </AdaptableCard>
            )
        }

        return (
            <div className="mb-4">
                {label && (
                    <div className="flex gap-1 items-center mb-2">
                        <span className="text-red-500 ltr:mr-1 rtl:ml-1">*</span>
                        <h5 className="text-sm font-semibold">{label}</h5>
                    </div>
                )}
                {current?.url ? (
                    <div className="relative group rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 w-full" style={{ aspectRatio: aspectRatio }}>
                        <img
                            src={current.url}
                            alt={current.name}
                            className="absolute inset-0 w-full h-full object-cover"
                            crossOrigin="anonymous"
                        />
                        <div className="absolute inset-0 bg-gray-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <button
                                type="button"
                                className="p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    onViewOpen(current)
                                }}
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
                            >
                                <HiTrash className="text-xl" />
                            </button>
                        </div>
                    </div>
                ) : (
                    <Upload
                        draggable
                        multiple={false}
                        uploadLimit={1}
                        beforeUpload={beforeUpload}
                        showList={false}
                        disabled={isUploading || cropLoading}
                        accept={allowedTypes.join(',')}
                        onChange={handleUpload}
                    >
                        {(isUploading || cropLoading) && (
                            <div className="absolute inset-0 bg-white/70 dark:bg-gray-900/60 flex items-center justify-center z-10">
                                <Spinner />
                            </div>
                        )}
                        <div className={[
                            'border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg border-none cursor-pointer hover:border-blue-500 transition-colors',
                            (isUploading || cropLoading) ? 'opacity-60 pointer-events-none' : ''
                        ].join(' ')}>
                            <div className="py-10 text-center flex flex-col items-center">
                                <HiOutlineUpload className="text-4xl mb-2 text-gray-400" />
                                <p className="font-semibold">
                                    <span className="text-gray-800 dark:text-white">{t('common.dropImage')} </span>
                                    <span className="text-blue-500">{t('common.browse')}</span>
                                </p>
                                <p className="mt-1 opacity-60 dark:text-white text-xs">
                                    {description || t('common.supportFormats')}
                                </p>
                            </div>
                        </div>
                    </Upload>
                )}
                {invalid && <div className="text-xs text-red-500 mt-2">{errorMessage}</div>}
            </div>
        )
    }

    return (
        <Field name={name}>
            {({ field, form, meta }: FieldProps) => {
                const isAvatar = variant === 'avatar'
                const dialogWidth = isAvatar ? 400 : 800


                return (
                    <>
                        {renderContent(field, form, meta)}
                        <Dialog
                            isOpen={viewOpen}
                            onClose={onDialogClose}
                            onRequestClose={onDialogClose}
                            width={dialogWidth}

                        >
                            <h5 className="mb-4">{selectedImg?.name}</h5>
                            {selectedImg?.url && (
                                <img
                                    className="w-full"
                                    style={{ aspectRatio: aspectRatio }}
                                    src={selectedImg.url}
                                    alt={selectedImg.name}
                                    crossOrigin="anonymous"
                                />
                            )}
                        </Dialog >

                        <Dialog
                            isOpen={cropOpen}
                            closable={false}
                            onClose={() => setCropOpen(false)}
                            onRequestClose={() => setCropOpen(false)}
                            width={dialogWidth}
                        >
                            <div className="p-4">
                                <h5 className="mb-4">{t('common.cropImage')}</h5>
                                <div className="p-4 relative left-0 right-0 bottom-0 top-0 w-full h-[380px] ">
                                    <Cropper
                                        image={cropUrl}
                                        crop={cropState}
                                        zoom={zoomState}
                                        aspect={aspectRatio}
                                        cropShape={isAvatar ? 'round' : 'rect'}
                                        showGrid={!isAvatar}
                                        objectFit='cover'
                                        zoomWithScroll={true}
                                        onCropChange={setCropState}
                                        onCropComplete={onCropComplete}
                                        onZoomChange={setZoomState}
                                        minZoom={1}
                                        maxZoom={10}
                                    />
                                </div>


                                <div className="flex justify-end gap-2 mt-4">
                                    <Button

                                        variant="twoTone"
                                        onClick={() => {
                                            setCropOpen(false)
                                            setTempFile(null)
                                            setCropUrl('')
                                        }}
                                        disabled={cropLoading}
                                    >
                                        {t('common.cancel')}
                                    </Button>
                                    <Button

                                        variant="solid"
                                        loading={cropLoading}
                                        onClick={() => handleCropConfirm(form, field.name)}
                                    >
                                        {t('common.confirm')}
                                    </Button>
                                </div>
                            </div>
                        </Dialog>
                    </>
                )
            }}
        </Field >
    )
}

export default ImageUpload
