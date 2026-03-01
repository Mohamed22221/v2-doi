import React from 'react'
import TextEllipsis from '../TextEllipsis'
import { Icon } from '@/components/ui'
import { useTranslation } from 'react-i18next'

type Props = {
    /** Main line (big text) */
    title: React.ReactNode

    /** Second line (small text) */
    subtitle?: React.ReactNode

    /** Optional prefix before subtitle (e.g. "ID:") */
    subtitlePrefix?: React.ReactNode

    /** Optional image or avatar */
    image?: string | React.ReactNode

    /** Image alt (used only if image is string) */
    imageAlt?: string

    /** Image size */
    imageSize?: 'sm' | 'md' | 'lg'

    /** Alignment */
    align?: 'start' | 'center' | 'end'

    /** Size variants */
    size?: 'sm' | 'md' | 'lg'

    /** Extra classes */
    className?: string
    titleClassName?: string
    subtitleClassName?: string
    subtitleLabel?: string
    titleLabel?: string
    variant?: 'default' | 'danger'
    trueImage?: boolean
}

/**
 * TwoLineText
 *
 * Reusable component for table cells:
 * - Optional image/avatar
 * - Line 1: title
 * - Line 2: subtitle
 */
export default function TwoLineText({
    title,
    subtitle,
    subtitlePrefix,
    image,
    imageAlt = 'avatar',
    imageSize = 'md',
    size = 'md',
    className = '',
    titleClassName = '',
    subtitleClassName = '',
    titleLabel = '',
    subtitleLabel = '',
    trueImage = false,
}: Props) {
    const { t } = useTranslation()

    const getNoDataText = (label?: string) => {
        if (!label) return t('common.noDataShort') || 'لا يوجد'
        return `${t('common.noDataShort') || 'لا يوجد'} ${label}`
    }

    const sizes = {
        sm: { title: 'text-sm', subtitle: 'text-xs', gap: 'gap-0.5' },
        md: { title: 'text-base', subtitle: 'text-sm', gap: 'gap-1' },
        lg: { title: 'text-lg', subtitle: 'text-base', gap: 'gap-1' },
    } as const

    const imageSizes = {
        sm: 'w-8 h-8',
        md: 'w-10 h-10',
        lg: 'w-12 h-12',
    } as const
    console.log(image)
    return (
        <div className={['flex gap-3', className].join(' ')}>
            {/* Image / Avatar */}
            {image && (
                <div className="flex-shrink-0">
                    {typeof image === 'string' ? (
                        <img
                            src={image}
                            alt={imageAlt}
                            className={[
                                imageSizes[imageSize],
                                'rounded-full object-cover',
                            ].join(' ')}
                            crossOrigin="anonymous"
                        />
                    ) : (
                        <div className="flex-shrink-0">
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <Icon name="assets" />
                            </div>
                        </div>
                    )}
                </div>
            )}
            {trueImage && image === undefined && (
                <div className="flex-shrink-0">
                    <div className="w-full h-full flex items-center justify-center text-gray-400 rounded-full">
                        <Icon name="assets" />
                    </div>
                </div>
            )}
            {/* Text */}
            <div className={[`flex ${subtitle ? "flex-col" : "items-center"}`, sizes[size].gap].join(' ')}>
                <div
                    className={[
                        'font-semibold text-gray-900 dark:text-gray-100 leading-snug',
                        sizes[size].title,
                        titleClassName,
                    ].join(' ')}
                >
                    {title || getNoDataText(titleLabel)}
                </div>

                <div
                    className={[
                        'text-gray-500 dark:text-gray-400 leading-snug',
                        sizes[size].subtitle,
                        subtitleClassName,
                    ].join(' ')}
                >
                    {subtitle && (
                        subtitlePrefix ? (
                            <>
                                <span className="mr-1">{subtitlePrefix}</span>
                                <TextEllipsis
                                    text={String(subtitle)}
                                    maxTextCount={25}
                                />
                            </>
                        ) : (
                            <TextEllipsis
                                text={String(subtitle)}
                                maxTextCount={25}
                            />
                        )
                    )}
                    {/* {!subtitle && getNoDataText(subtitleLabel)} */}
                </div>
            </div>
        </div>
    )
}
