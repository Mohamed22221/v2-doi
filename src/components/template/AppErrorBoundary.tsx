import { ErrorBoundary, FallbackProps } from 'react-error-boundary'
import ErrorState from '../shared/ErrorState'
import i18n from '@/locales'

type Props = {
    children: React.ReactNode
}

const ErrorFallback = ({ error }: FallbackProps) => {
    const message =
        error instanceof Error
            ? error.message
            : i18n.t('common.somethingWentWrong')
    return (
        <div>
            <ErrorState message={message} fullPage={true} />
        </div>
    )
}

export const AppErrorBoundary = ({ children }: Props) => {
    return (
        <ErrorBoundary
            FallbackComponent={ErrorFallback}
            onReset={() => {
                // optional: reset state / refetch
            }}
        >
            {children}
        </ErrorBoundary>
    )
}
