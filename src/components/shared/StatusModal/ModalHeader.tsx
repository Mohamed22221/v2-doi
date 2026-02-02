import React from 'react'
import { StatusModalConfig } from './types'

interface ModalHeaderProps {
    config: StatusModalConfig
}

const ModalHeader = ({ config }: ModalHeaderProps) => {
    return (
        <div className="flex flex-col items-center p-1 text-center">
            {config.icon}
            <h3 className="mt-3 text-xl font-bold text-gray-900 dark:text-gray-50 mb-2">
                {config.title}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-2 px-1">
                {config.description}
            </p>
        </div>
    )
}

export default ModalHeader
