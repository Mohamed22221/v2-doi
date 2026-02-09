import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { SellerItem } from '@/api/types/sellers'
import { CsvColumnDef } from '@/utils/csv/csv.utils'

export const useSellerCsvColumns = () => {
    const { t } = useTranslation()

    return useMemo<CsvColumnDef<SellerItem>[]>(
        () => [
            {
                header: t('sellers.table.columns.name'),
                accessor: (row: SellerItem) => `${row.user.firstName} ${row.user.lastName}`,
            },
            {
                header: t('sellers.table.columns.email'),
                accessor: (row: SellerItem) => row.user.email,
            },
            {
                header: t('sellers.table.columns.phone'),
                accessor: (row: SellerItem) => row.user.phone,
            },
            {
                header: t('sellers.table.columns.status'),
                accessor: (row: SellerItem) =>
                    row.approvalStatus === 'approved'
                        ? t('sellers.table.status.approved')
                        : row.approvalStatus === 'pending'
                            ? t('sellers.table.status.pending')
                            : t('sellers.table.status.rejected'),
            },
            {
                header: t('sellers.table.columns.registeredDate'),
                accessor: (row: SellerItem) => row.user.createdAt,
            },
        ],
        [t],
    )
}
