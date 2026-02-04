import React from 'react'

/**
 * Available visual variants for the status pill
 */
type StatusVariant = 'success' | 'danger' | 'warning' | 'info' | 'neutral'

/**
 * Props for StatusPill component
 */
type Props = {
  /**
   * Boolean status value.
   * - true  → active / success
   * - false → inactive / danger
   * - null / undefined → neutral
   */
  value?: boolean | null

  /**
   * Manually force a visual variant.
   * If provided, it overrides `value`.
   */
  variant?: StatusVariant

  /**
   * Text shown when `value === true`
   */
  activeText?: string

  /**
   * Text shown when `value === false`
   */
  inactiveText?: string

  /**
   * Custom label.
   * If provided, it overrides activeText / inactiveText.
   */
  label?: string

  /**
   * Size of the pill
   */
  size?: 'sm' | 'md' | 'lg' | 'smxs'

  /**
   * Additional custom classes
   */
  className?: string
}

/**
 * Styling map for each variant
 */
const VARIANT_STYLES: Record<
  StatusVariant,
  { wrap: string; dot: string; text: string }
> = {
  success: {
    wrap: 'bg-emerald-50',
    dot: 'bg-emerald-500',
    text: 'text-emerald-700',
  },
  danger: {
    wrap: 'bg-red-50',
    dot: 'bg-red-500',
    text: 'text-red-700',
  },
  warning: {
    wrap: 'bg-amber-50',
    dot: 'bg-amber-500',
    text: 'text-amber-700',
  },
  info: {
    wrap: 'bg-blue-50',
    dot: 'bg-blue-500',
    text: 'text-blue-700',
  },
  neutral: {
    wrap: 'bg-gray-100',
    dot: 'bg-gray-500',
    text: 'text-gray-700',
  },
}

/**
 * Size styles for the pill and dot
 */
const SIZE_STYLES = {
  smxs: {
    wrap: 'px-2 py-2 text-xs gap-2',
    dot: 'w-1.5 h-1.5',
  },
  sm: {
    wrap: 'px-4 py-2 text-sm gap-3',
    dot: 'w-2 h-2',
  },
  md: {
    wrap: 'px-5 py-2.5 text-base gap-3.5',
    dot: 'w-3 h-3',
  },
  lg: {
    wrap: 'px-6 py-3 text-lg gap-4',
    dot: 'w-4 h-4',
  },
} as const

/**
 * StatusPill
 *
 * Reusable status badge component.
 * - Supports boolean-based status (active / inactive)
 * - Supports manual variant override
 * - Fully customizable text and size
 */
export default function StatusPill({
  value,
  variant,
  activeText = 'Active',
  inactiveText = 'Not Active',
  label,
  size = 'sm',
  className = '',
}: Props) {
  /**
   * Resolve the final variant:
   * 1) Use `variant` if provided
   * 2) Map boolean value to success/danger
   * 3) Fallback to neutral
   */
  const resolvedVariant: StatusVariant =
    variant ??
    (value === true ? 'success' : value === false ? 'danger' : 'neutral')

  const styles = VARIANT_STYLES[resolvedVariant]
  const sizeStyles = SIZE_STYLES[size]

  /**
   * Resolve the label text:
   * - Use custom label if provided
   * - Otherwise derive it from boolean value
   */
  const resolvedLabel =
    label ??
    (value === true ? activeText : value === false ? inactiveText : '—')

  return (
    <span
      className={[
        'inline-flex items-center rounded-full font-medium',
        styles.wrap,
        styles.text,
        sizeStyles.wrap,
        className,
      ].join(' ')}
    >
      {/* Status dot */}
      <span
        className={[
          'rounded-full',
          styles.dot,
          sizeStyles.dot,
        ].join(' ')}
      />

      {/* Status label */}
      {resolvedLabel}
    </span>
  )
}
