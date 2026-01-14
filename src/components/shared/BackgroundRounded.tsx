import React from 'react'

const BackgroundRounded = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="bg-white dark:bg-primary-900 py-3  rounded-[16px] shadow-primary dark:shadow-dark">
            {children}
        </div>
    )
}

export default BackgroundRounded
