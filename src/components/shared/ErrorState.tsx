import React from 'react'

type ErrorStateProps = {
    title?: string
    message?: string
    height?: number | string
    fullPage?: boolean
    className?: string
    imgClassName?: string
    image?: string
    children?: React.ReactNode
}

const ErrorState: React.FC<ErrorStateProps> = ({
    message = "please try agian",
    height = '300px',
    fullPage = false,
    className = '',
    imgClassName = 'mx-auto mb-2 max-w-[150px]',
    image = '/img/others/error.png',
    children,
}) => {
    const style: React.CSSProperties | undefined = fullPage
        ? undefined
        : { height: typeof height === 'number' ? `${height}px` : height }

    return (
        <div
            className={[
                'flex flex-col items-center justify-center gap-2 text-center px-4',
                fullPage ? 'min-h-screen' : '',
                className,
            ].join(' ')}
            style={style}
        >
            <img className={imgClassName} src={image} alt="Empty state" />
            <h3 className="font-semibold text-red-500 dark:text-red-900">
                Something went wrong
            </h3>

            {message && (
                <p className="mt-1 text-sm text-primary-800 dark:text-primary-100">
                    {message}
                </p>
            )}

            {children && <div className="mt-3">{children}</div>}
        </div>
    )
}

export default ErrorState
