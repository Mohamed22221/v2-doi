import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { ServerFilterConfig } from '@/utils/hooks/useServerTable'

export function useAssignedAuctionsTableFilters() {
    const { t } = useTranslation()

    const filtersConfig: ServerFilterConfig[] = useMemo(
        () => [
            {
                key: 'status',
                label: t('halls.details.table.filters.status'),
                value: null,
                valueType: 'string',
                options: [
                    {
                        label: t('halls.details.table.status.live'),
                        value: 'ACTIVE',
                    },
                    {
                        label: t('halls.details.table.status.scheduled'),
                        value: 'SCHEDULED',
                    },
                    {
                        label: t('halls.details.table.status.hidden'),
                        value: 'HIDDEN',
                    },
                    {
                        label: t('halls.details.table.status.ended'),
                        value: 'ENDED',
                    },
                    {
                        label: t('halls.details.table.status.rejected'),
                        value: 'REJECTED',
                    },
                    {
                        label: t('halls.details.table.status.cancelled'),
                        value: 'CANCELLED',
                    },
                ],
                placeholder: t('halls.details.table.filters.allStatus'),
                isSearchable: false,
            },
        ],
        [t],
    )

    return filtersConfig
}
