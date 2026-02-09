import { useTranslation } from 'react-i18next'
import { Dropdown, Button, Spinner } from '@/components/ui'
import { HiDownload } from 'react-icons/hi'
import { useCsvExport, ExportOptions } from '@/utils/hooks/useCsvExport'

interface CsvExportButtonProps<T> extends ExportOptions<T> {
    className?: string
}

export default function CsvExportButton<T>({
    className,
    ...exportOptions
}: CsvExportButtonProps<T>) {
    const { t } = useTranslation()
    const { exportCurrentPage, exportAll, isExporting, progress } =
        useCsvExport(exportOptions)

    const title = (
        <Button
            size="sm md:md"
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
                onClick={exportCurrentPage}
                disabled={isExporting}
            >
                {t('viewTable.exportCurrentPage')}
            </Dropdown.Item>
            {exportOptions.fetchPage && (
                <Dropdown.Item
                    eventKey="all"
                    onClick={exportAll}
                    disabled={isExporting}
                >
                    {t('viewTable.exportAll')}
                </Dropdown.Item>
            )}
        </Dropdown>
    )
}
