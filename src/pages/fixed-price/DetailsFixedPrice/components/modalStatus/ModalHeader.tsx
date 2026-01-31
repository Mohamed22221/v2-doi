import React from 'react'
import { ModalConfig } from './types'

interface ModalHeaderProps {
    config: ModalConfig
}

const ModalHeader = ({ config }: ModalHeaderProps) => {
    return (
        <div className="flex flex-col items-center p-2">
            {config.icon}
            <h3 className="mt-3 text-xl font-bold text-gray-900 dark:text-gray-50 mb-2">
                {config.title}
            </h3>
            <p className="text-center text-gray-500 dark:text-gray-400 mb-3 px-4">
                {config.description}
            </p>
        </div>
    )
}

export default ModalHeader
