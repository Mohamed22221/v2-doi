import { forwardRef } from 'react'
import classNames from 'classnames'
import { useConfig } from '../ConfigProvider'
import { useForm } from '../Form/context'
import { useInputGroup } from '../InputGroup/context'
import useColorLevel from '../hooks/useColorLevel'
import { CONTROL_SIZES, SIZES } from '../utils/constants'
import { Spinner } from '../Spinner'
import type { CommonProps, TypeAttributes, ColorLevel } from '../@types/common'
import type { ReactNode, ComponentPropsWithRef, MouseEvent } from 'react'

export interface ButtonProps
    extends CommonProps,
        Omit<ComponentPropsWithRef<'button'>, 'onClick'> {
    active?: boolean
    block?: boolean
    color?: string // e.g. "red", "green", "blue", or "red-600"
    disabled?: boolean
    icon?: string | ReactNode
    loading?: boolean
    onClick?: (e: MouseEvent<HTMLButtonElement>) => void
    shape?: TypeAttributes.Shape
    size?: TypeAttributes.Size
    variant?: 'solid' | 'twoTone' | 'plain' | 'default' | 'link'
}

type ButtonColor = {
    bgColor: string
    hoverColor: string
    activeColor: string
    textColor: string
}

// ✅ White-listed colors (Tailwind-safe; no dynamic class generation issues)
const SOLID_COLOR_MAP: Record<
    string,
    { base: string; hover: string; active: string; text: string }
> = {
    red: {
        base: 'bg-red-500',
        hover: 'hover:bg-red-600',
        active: 'active:bg-red-700',
        text: 'text-white',
    },
    green: {
        base: 'bg-green-500',
        hover: 'hover:bg-green-600',
        active: 'active:bg-green-700',
        text: 'text-white',
    },
    blue: {
        base: 'bg-blue-500',
        hover: 'hover:bg-blue-600',
        active: 'active:bg-blue-700',
        text: 'text-white',
    },
}

const LINK_COLOR_MAP: Record<
    string,
    { text: string; hoverBg: string; activeBg: string; activeBgOn: string }
> = {
    red: {
        text: 'text-red-600 dark:text-red-400',
        hoverBg: 'hover:bg-red-50 dark:hover:bg-red-500/20',
        activeBg: 'active:bg-red-100 dark:active:bg-red-500/30',
        activeBgOn: 'bg-red-50 dark:bg-red-500/20',
    },
    green: {
        text: 'text-green-600 dark:text-green-400',
        hoverBg: 'hover:bg-green-50 dark:hover:bg-green-500/20',
        activeBg: 'active:bg-green-100 dark:active:bg-green-500/30',
        activeBgOn: 'bg-green-50 dark:bg-green-500/20',
    },
    blue: {
        text: 'text-blue-600 dark:text-blue-400',
        hoverBg: 'hover:bg-blue-50 dark:hover:bg-blue-500/20',
        activeBg: 'active:bg-blue-100 dark:active:bg-blue-500/30',
        activeBgOn: 'bg-blue-50 dark:bg-blue-500/20',
    },
}

const DEFAULT_COLOR_MAP: Record<
    string,
    {
        bg: string
        border: string
        text: string
        hover: string
        active: string
        activeBg: string
    }
> = {
    red: {
        bg: 'bg-white dark:bg-gray-700',
        border: 'border border-red-500',
        text: 'text-red-600 dark:text-red-400',
        hover: 'hover:bg-red-50 dark:hover:bg-red-500/20',
        active: 'active:border-red-600',
        activeBg: 'active:bg-red-100 dark:active:bg-red-500/30',
    },
    green: {
        bg: 'bg-white dark:bg-gray-700',
        border: 'border border-green-500',
        text: 'text-green-600 dark:text-green-400',
        hover: 'hover:bg-green-50 dark:hover:bg-green-500/20',
        active: 'active:border-green-600',
        activeBg: 'active:bg-green-100 dark:active:bg-green-500/30',
    },
    blue: {
        bg: 'bg-white dark:bg-gray-700',
        border: 'border border-blue-500',
        text: 'text-blue-600 dark:text-blue-400',
        hover: 'hover:bg-blue-50 dark:hover:bg-blue-500/20',
        active: 'active:border-blue-600',
        activeBg: 'active:bg-blue-100 dark:active:bg-blue-500/30',
    },
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
    const {
        active = false,
        block = false,
        children,
        className,
        color = '',
        disabled,
        icon,
        loading = false,
        shape = 'round',
        size,
        variant = 'default',
        ...rest
    } = props

    const { themeColor, controlSize, primaryColorLevel } = useConfig()
    const formControlSize = useForm()?.size
    const inputGroupSize = useInputGroup()?.size

    const defaultClass = 'button'
    const sizeIconClass = 'inline-flex items-center justify-center'

    const splitedColor = color?.split('-') || []
    const buttonSize = size || inputGroupSize || formControlSize || controlSize

    const buttonColor = splitedColor[0] || themeColor
    const buttonColorLevel = splitedColor[1] || primaryColorLevel

    const [increaseLevel, decreaseLevel] = useColorLevel(
        buttonColorLevel as ColorLevel,
    )

    const getButtonSize = () => {
        let sizeClass = ''
        switch (buttonSize) {
            case SIZES.LG:
                sizeClass = classNames(
                    `h-${CONTROL_SIZES.lg}`,
                    icon && !children
                        ? `w-${CONTROL_SIZES.lg} ${sizeIconClass} text-2xl`
                        : 'px-8 py-2 text-base',
                )
                break
            case SIZES.SM:
                sizeClass = classNames(
                    `h-${CONTROL_SIZES.sm}`,
                    icon && !children
                        ? `w-${CONTROL_SIZES.sm} ${sizeIconClass} text-lg`
                        : 'px-1 py-2 text-sm',
                )
                break
            case SIZES.XS:
                sizeClass = classNames(
                    `h-${CONTROL_SIZES.xs}`,
                    icon && !children
                        ? `w-${CONTROL_SIZES.xs} ${sizeIconClass} text-base`
                        : 'px-3 py-1 text-xs',
                )
                break
            default:
                sizeClass = classNames(
                    `h-${CONTROL_SIZES.md}`,
                    icon && !children
                        ? `w-${CONTROL_SIZES.md} ${sizeIconClass} text-xl`
                        : 'px-8 py-2',
                )
                break
        }
        return sizeClass
    }

    const disabledClass = 'opacity-50 cursor-not-allowed'

    const getBtnColor = ({
        bgColor,
        hoverColor,
        activeColor,
        textColor,
    }: ButtonColor) => {
        return `${bgColor} ${
            disabled || loading ? disabledClass : hoverColor + ' ' + activeColor
        } ${textColor}`
    }

    const solidColor = () => {
        const key = (buttonColor || '').toLowerCase()
        const preset = SOLID_COLOR_MAP[key]

        if (preset) {
            const btn = {
                bgColor: active
                    ? preset.active.replace('active:', '')
                    : preset.base,
                textColor: preset.text,
                hoverColor: active ? '' : preset.hover,
                activeColor: preset.active,
            }
            return getBtnColor(btn)
        }

        const btn = {
            bgColor: active
                ? `bg-${buttonColor}-${increaseLevel}`
                : `bg-${buttonColor}-${buttonColorLevel}`,
            textColor: 'text-white',
            hoverColor: active
                ? ''
                : `hover:bg-${buttonColor}-${decreaseLevel}`,
            activeColor: `active:bg-${buttonColor}-${increaseLevel}`,
        }
        return getBtnColor(btn)
    }

    const twoToneColor = () => {
        const btn = {
            bgColor: active
                ? `bg-${buttonColor}-200 dark:bg-${buttonColor}-50`
                : `bg-${buttonColor}-50 dark:bg-${buttonColor}-500/20`,
            textColor: `text-${buttonColor}-${buttonColorLevel} dark:text-${buttonColor}-50`,
            hoverColor: active
                ? ''
                : `hover:bg-${buttonColor}-100 dark:hover:bg-${buttonColor}-500/30`,
            activeColor: `active:bg-${buttonColor}-200 dark:active:bg-${buttonColor}-500/40`,
        }
        return getBtnColor(btn)
    }

    const defaultColor = () => {
        const key = (buttonColor || '').toLowerCase()
        const preset = DEFAULT_COLOR_MAP[key]

        if (preset) {
            const btn = {
                bgColor: `${preset.bg} ${preset.border}`,
                textColor: preset.text,
                hoverColor: active ? '' : preset.hover,
                activeColor: `${preset.active} ${preset.activeBg}`,
            }
            return getBtnColor(btn)
        }

        const btn = {
            bgColor: active
                ? `bg-gray-100 border border-gray-300 dark:bg-gray-500 dark:border-gray-500`
                : `bg-white border border-gray-300 dark:bg-gray-700 dark:border-gray-700`,
            textColor: `text-gray-600 dark:text-gray-100`,
            hoverColor: active
                ? ''
                : `hover:bg-gray-50 dark:hover:bg-gray-600`,
            activeColor: `active:bg-gray-100 dark:active:bg-gray-500 dark:active:border-gray-500`,
        }
        return getBtnColor(btn)
    }

    const plainColor = () => {
        const btn = {
            bgColor: active
                ? `bg-gray-100 dark:bg-gray-500`
                : 'bg-transparent border border-transparent',
            textColor: `text-gray-600 dark:text-gray-100`,
            hoverColor: active
                ? ''
                : `hover:bg-gray-50 dark:hover:bg-gray-600`,
            activeColor: `active:bg-gray-100 dark:active:bg-gray-500 dark:active:border-gray-500`,
        }
        return getBtnColor(btn)
    }

    const linkColor = () => {
        const key = (buttonColor || '').toLowerCase()
        const preset = LINK_COLOR_MAP[key]

        if (preset) {
            const btn = {
                bgColor: active
                    ? preset.activeBgOn
                    : 'bg-transparent border border-transparent',
                textColor: preset.text,
                hoverColor: active ? '' : preset.hoverBg,
                activeColor: preset.activeBg,
            }
            return getBtnColor(btn)
        }

        const btn = {
            bgColor: active
                ? `bg-${buttonColor}-50 dark:bg-${buttonColor}-500/20`
                : 'bg-transparent border border-transparent',
            textColor: `text-${buttonColor}-${buttonColorLevel} dark:text-${buttonColor}-50`,
            hoverColor: active
                ? ''
                : `hover:bg-${buttonColor}-50 dark:hover:bg-${buttonColor}-500/20`,
            activeColor: `active:bg-${buttonColor}-100 dark:active:bg-${buttonColor}-500/30`,
        }
        return getBtnColor(btn)
    }

    const btnColor = () => {
        switch (variant) {
            case 'solid':
                return solidColor()
            case 'twoTone':
                return twoToneColor()
            case 'plain':
                return plainColor()
            case 'default':
                return defaultColor()
            case 'link':
                return linkColor()
            default:
                return defaultColor()
        }
    }

    const classes = classNames(
        defaultClass,
        btnColor(),
        `radius-${shape}`,
        getButtonSize(),
        className,
        block ? 'w-full' : '',
    )

    const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
        const { onClick } = props
        if (disabled || loading) {
            e.preventDefault()
            return
        }
        onClick?.(e)
    }

    const renderChildren = () => {
        if (loading && children) {
            return (
                <span className="flex items-center justify-center">
                    <Spinner enableTheme={false} className="mr-1" />
                    {children}
                </span>
            )
        }

        if (icon && !children && loading) {
            return <Spinner enableTheme={false} />
        }

        if (icon && !children && !loading) {
            return <div>{icon}</div>
        }

        if (icon && children && !loading) {
            return (
                <span className="flex items-center justify-center">
                    <span className="text-lg text-color-red">{icon}</span>
                    <span className="ltr:ml-1 rtl:mr-1">{children}</span>
                </span>
            )
        }

        return <>{children}</>
    }

    return (
        <button ref={ref} className={classes} {...rest} onClick={handleClick}>
            {renderChildren()}
        </button>
    )
})

Button.displayName = 'Button'

export default Button
