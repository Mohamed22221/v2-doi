import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { SellerItem } from '@/api/types/sellers'
import { CsvColumnDef } from '@/utils/csv/csv.utils'

export const useSellerCsvColumns = () => {
    const { t } = useTranslation()

    return useMemo<CsvColumnDef<SellerItem>[]>(
        () => [
            {
                header: t('users.table.columns.name'),
                accessor: (row: SellerItem) => `${row.user.firstName} ${row.user.lastName}`,
            },
            {
                header: t('users.table.columns.email'),
                accessor: (row: SellerItem) => row.user.email,
            },
            {
                header: t('users.table.columns.phone'),
                accessor: (row: SellerItem) => row.user.phone,
            },
            {
                header: t('users.table.status.status'),
                accessor: (row: SellerItem) =>
                    row.approvalStatus === 'approved'
                        ? t('fixedPrice.sellers.status.approved')
                        : row.approvalStatus === 'pending'
                            ? t('fixedPrice.sellers.status.pending')
                            : t('fixedPrice.sellers.status.rejected'),
            },
            {
                header: t('users.table.columns.registeredDate'),
                accessor: (row: SellerItem) => row.user.createdAt,
            },
        ],
        [t],
    )
}
