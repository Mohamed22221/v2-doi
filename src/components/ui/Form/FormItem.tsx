import React, { forwardRef } from 'react'
import classNames from 'classnames'
import { useForm } from './context'
import { useConfig } from '../ConfigProvider'
import { CONTROL_SIZES, LAYOUT } from '../utils/constants'
import type { CommonProps, TypeAttributes } from '../@types/common'
import type { ReactNode } from 'react'
export interface FormItemProps extends CommonProps {
    asterisk?: boolean
    errorMessage?: string
    extra?: string | ReactNode
    htmlFor?: string
    invalid?: boolean | ''
    label?: string
    labelClass?: string
    labelWidth?: string | number
    layout?: TypeAttributes.FormLayout
    size?: TypeAttributes.ControlSize
}

const FormItem = forwardRef<HTMLDivElement, FormItemProps>((props, ref) => {
    const {
        asterisk,
        children,
        className,
        errorMessage,
        extra,
        htmlFor,
        invalid,
        label,
        labelClass,
        labelWidth,
        layout,
        style,
        size,
    } = props

    const formContext = useForm()
    const { controlSize } = useConfig()

    const formItemLabelHeight = size || formContext?.size || controlSize
    const formItemLabelWidth = labelWidth || formContext?.labelWidth
    const formItemLayout = layout || formContext?.layout

    const getFormLabelLayoutClass = () => {
        switch (formItemLayout) {
            case LAYOUT.HORIZONTAL:
                return label
                    ? `h-${CONTROL_SIZES[formItemLabelHeight]} ${label && 'ltr:pr-2 rtl:pl-2'
                    }`
                    : 'ltr:pr-2 rtl:pl-2'
            case LAYOUT.VERTICAL:
                return `mb-2`
            case LAYOUT.INLINE:
                return `h-${CONTROL_SIZES[formItemLabelHeight]} ${label && 'ltr:pr-2 rtl:pl-2'
                    }`
            default:
                break
        }
    }

    const formItemClass = classNames(
        'form-item',
        formItemLayout,
        className,
        invalid ? 'invalid' : '',
    )

    const formLabelClass = classNames(
        'form-label',
        label && getFormLabelLayoutClass(),
        labelClass,
    )

    const formLabelStyle = () => {
        if (formItemLayout === LAYOUT.HORIZONTAL) {
            return { ...style, ...{ minWidth: formItemLabelWidth } }
        }

        return { ...style }
    }



    return (
        <div ref={ref} className={formItemClass}>
            <label
                htmlFor={htmlFor}
                className={formLabelClass}
                style={formLabelStyle()}
            >
                {asterisk && (
                    <span className="text-red-500 ltr:mr-1 rtl:ml-1">*</span>
                )}
                {label}
                {extra && <span>{extra}</span>}
                {label && formItemLayout !== 'vertical' && ':'}
            </label>
            <div
                className={
                    formItemLayout === LAYOUT.HORIZONTAL
                        ? 'w-full flex flex-col justify-center relative '
                        : ''
                }
            >
                {children}
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
            </div>
        </div>
    )
})

FormItem.displayName = 'FormItem'

export default FormItem
