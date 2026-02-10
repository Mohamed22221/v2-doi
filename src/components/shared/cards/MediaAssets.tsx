import BackgroundRounded from '@/components/shared/BackgroundRounded'
import { HiOutlinePhotograph } from 'react-icons/hi'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import { Dialog } from '@/components/ui'

interface MediaAssetsProps {
    media?: string[]
    title?: string
}

const MediaAssets = ({ media, title }: MediaAssetsProps) => {
    const { t } = useTranslation()
    const [viewImage, setViewImage] = useState<string | null>(null)

    return (
        <BackgroundRounded>
            <div className="p-6">
                <div className="flex items-center gap-2 mb-6">
                    <div className="bg-blue-50 dark:bg-blue-900/30 p-2 rounded-lg text-blue-500">
                        <HiOutlinePhotograph size={24} />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        {title || t('common.image') || 'Media Assets'}
                    </h3>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {media?.map((url, index) => (
                        <div
                            key={index}
                            className="aspect-square relative rounded-xl overflow-hidden border border-gray-100 dark:border-gray-800 cursor-pointer hover:opacity-90 transition-opacity"
                            onClick={() => setViewImage(url)}
                        >
                            <img
                                src={url}
                                alt={`Asset ${index}`}
                                className="w-full h-full object-cover"
                                crossOrigin="anonymous"
                            />
                        </div>
                    ))}
                    {(!media || media.length === 0) && (
                        <div className="col-span-full py-10 text-center text-neutral-400">
                            {t('common.noData') || 'No media assets found'}
                        </div>
                    )}
                </div>
            </div>

            <Dialog
                isOpen={!!viewImage}
                onClose={() => setViewImage(null)}
                onRequestClose={() => setViewImage(null)}
            >
                <div className="p-4 flex justify-center items-center">
                    <img
                        src={viewImage || ''}
                        alt="Preview"
                        className="max-w-full max-h-[80vh] rounded-lg object-contain mt-4"
                        crossOrigin="anonymous"
                    />
                </div>
            </Dialog>
        </BackgroundRounded>
    )
}

export default MediaAssets
