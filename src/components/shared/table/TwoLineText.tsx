import React from 'react'

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
  align = 'start',
  size = 'md',
  className = '',
  titleClassName = '',
  subtitleClassName = '',
}: Props) {
  const alignClass =
    align === 'center'
      ? 'items-center text-center'
      : align === 'end'
      ? 'items-end text-right'
      : 'items-start text-left'

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

  return (
    <div className={['flex gap-3', alignClass, className].join(' ')}>
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
            />
          ) : (
            image
          )}
        </div>
      )}

      {/* Text */}
      <div className={['flex flex-col', sizes[size].gap].join(' ')}>
        <div
          className={[
            'font-semibold text-gray-900 dark:text-gray-100 leading-snug',
            sizes[size].title,
            titleClassName,
          ].join(' ')}
        >
          {title}
        </div>

        {subtitle !== undefined && subtitle !== null && (
          <div
            className={[
              'text-gray-500 dark:text-gray-400 leading-snug',
              sizes[size].subtitle,
              subtitleClassName,
            ].join(' ')}
          >
            {subtitlePrefix ? (
              <>
                <span className="mr-1">{subtitlePrefix}</span>
                <span>{subtitle}</span>
              </>
            ) : (
              subtitle
            )}
          </div>
        )}
      </div>
    </div>
  )
}
