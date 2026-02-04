import { useTranslation } from 'react-i18next'
import BackgroundRounded from '@/components/shared/BackgroundRounded'
import AccountId from '@/components/shared/cards/AccountId'
import { Button } from '@/components/ui'
import Skeleton from '@/components/ui/Skeleton'

import { DisputeStatus } from '@/api/types/disputes'

interface DisputeHeaderProps {
    id: string
    status?: DisputeStatus
    onExport: () => void
    onResolve: () => void
    onRequestEvidence: () => void
}



const DisputeHeader = ({
    id,
    status,
    onExport,
    onResolve,
    onRequestEvidence,
}: DisputeHeaderProps) => {
    const { t } = useTranslation()

    const isResolved = status?.startsWith('resolved-')


    return (
        <BackgroundRounded>
            <div className="flex flex-col gap-4 p-4 sm:p-6 lg:flex-row lg:items-center lg:justify-between lg:gap-6">
                <div>
                    <h2 className="text-xl sm:text-2xl font-semibold">
                        {t('disputes.details.title')}
                    </h2>
                    <AccountId
                        id={id}
                        label={t('disputes.details.overview.disputeId')}
                        className="!justify-start"
                    />
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    <Button
                        variant="default"
                        size="md"
                        className="flex-1 sm:flex-none"
                        onClick={onExport}
                    >
                        {t('disputes.actions.exportCase')}
                    </Button>
                    {!isResolved && (
                        <>
                            <Button
                                variant="default"
                                size="md"
                                className="flex-1 sm:flex-none"
                                onClick={onResolve}
                            >
                                {t('disputes.actions.resolveDispute')}
                            </Button>
                            <Button
                                variant="solid"
                                size="md"
                                color="primary"
                                className="w-full sm:w-auto"
                                onClick={onRequestEvidence}
                            >
                                {t('disputes.actions.requestEvidence')}
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </BackgroundRounded>
    )
}

export default DisputeHeader
