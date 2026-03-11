import { useTranslation } from 'react-i18next'
import { Dropdown, Button, Spinner } from '@/components/ui'
import { HiDownload } from 'react-icons/hi'
import { useCsvExport, ExportOptions } from '@/utils/hooks/useCsvExport'

interface CsvExportButtonProps<T> extends ExportOptions<T> {
    className?: string
    size?: 'sm' | 'md'
}

export default function CsvExportButton<T>({
    className,
    size,
    ...exportOptions
}: CsvExportButtonProps<T>) {
    const { t } = useTranslation()
    const { exportCurrentPage, exportAll, isExporting, progress } =
        useCsvExport(exportOptions)

    const title = (
        <Button
            size={size ? size : 'sm md:md'}
            className={className}
            icon={
                isExporting ? (
                    <Spinner size={20} />
                ) : (
                    <HiDownload className="text-primary-500 dark:text-primary-100" />
                )
            }
            disabled={isExporting}
        >
            {isExporting
                ? `${t('viewTable.exporting')} (${progress}%)`
                : t('viewTable.defaultExportButtonText')}
        </Button>
    )

    return (
        <Dropdown renderTitle={title} placement="bottom-end">
            <Dropdown.Item
                eventKey="current"
                disabled={isExporting}
                onClick={exportCurrentPage}
            >
                {t('viewTable.exportCurrentPage')}
            </Dropdown.Item>
            {exportOptions.fetchPage && (
                <Dropdown.Item
                    eventKey="all"
                    disabled={isExporting}
                    onClick={exportAll}
                >
                    {t('viewTable.exportAll')}
                </Dropdown.Item>
            )}
        </Dropdown>
    )
}
