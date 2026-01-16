import React from 'react'

const BackgroundRounded = ({ children , className }: { children: React.ReactNode , className?:string }) => {
    return (
        <div className={`bg-white dark:bg-primary-900 py-3  rounded-[16px] shadow-primary dark:shadow-dark ${className }`}>
            {children}
        </div>
    )
}

export default BackgroundRounded
