import React from 'react'

type SectionHeaderProps = {
    title: string | React.ReactNode
    className?: string
    isUppercase?: boolean
}

const SectionHeader = ({ title, className = '', isUppercase = false }: SectionHeaderProps) => {
    return (
        <h3 className={`text-base font-semibold text-neutral-300 ${isUppercase ? 'uppercase' : ''} tracking-wider mb-6 ${className}`}>
            {title}
        </h3>
    )
}

export default SectionHeader
