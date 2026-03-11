import { useTranslation } from 'react-i18next'
import { Button, Icon } from '@/components/ui'
import { HiOutlinePlus } from 'react-icons/hi'
import CsvExportButton from '@/components/shared/CsvExportButton'
import { CsvColumnDef } from '@/utils/csv/csv.utils'

interface TableHeaderProps<T> {
    isDraggable: boolean
    onAddClick: () => void
    showExportButton?: boolean
    csvFileNamePrefix?: string
    csvColumns?: CsvColumnDef<T>[]
    csvData?: T[]
}

export default function AssignedAuctionsTableHeader<T>({
    isDraggable,
    onAddClick,
    showExportButton,
    csvFileNamePrefix,
    csvColumns,
    csvData,
}: TableHeaderProps<T>) {
    const { t } = useTranslation()

    if (!isDraggable && !showExportButton) return null

    return (
        <>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 mb-6 px-4 md:px-0 border-b mt-2 border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-3 md:gap-4 md:px-5">
                    <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 md:w-auto md:h-auto">
                        <Icon
                            name="bundleList"
                            className="w-5 h-5 md:w-6 md:h-6"
                        />
                    </div>
                    <div className="flex flex-col gap-0.5">
                        <h3 className="text-base sm:text-lg md:text-xl font-bold text-[#1E293B] dark:text-gray-100">
                            {t('halls.details.header.title')}
                        </h3>
                        <p className="text-[10px] sm:text-xs md:text-sm text-slate-400 dark:text-gray-400 max-w-[600px]">
                            {t('halls.details.header.subtitle')}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto md:px-5">
                    {showExportButton && csvColumns && (
                        <CsvExportButton
                            fileNamePrefix={csvFileNamePrefix || 'export'}
                            columns={csvColumns}
                            currentData={csvData}
                            size="sm"
                            className="flex-1 md:flex-none h-7 sm:h-11 px-7"
                        />
                    )}
                    {isDraggable && (
                        <Button
                            type="button"
                            variant="solid"
                            size="sm"
                            className="!rounded-xl font-bold px-3 sm:px-6 h-9 sm:h-11 flex items-center justify-center gap-1.5 sm:gap-2 flex-1 md:flex-none text-xs sm:text-base md:size-md"
                            icon={
                                <HiOutlinePlus className="text-primary-50 dark:text-primary-100 w-3.5 h-3.5 sm:w-5 sm:h-5" />
                            }
                            onClick={onAddClick}
                        >
                            {t('halls.details.header.addItems')}
                        </Button>
                    )}
                </div>
            </div>

            {isDraggable && (
                <div className="flex items-center gap-3 md:gap-4 p-3 md:p-5 mx-4 md:mx-5 bg-[#FFFBEB] dark:bg-yellow-900/10 border border-[#FEF3C7] dark:border-yellow-900/20 rounded-2xl mb-3 shadow-sm">
                    <Icon
                        name="infoAlert"
                        className="text-yellow-400 w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"
                    />
                    <p className="text-[11px] sm:text-xs md:text-sm text-neutral-950 dark:text-neutral-200 leading-normal font-semibold">
                        {t('halls.details.banner.draggable')}
                    </p>
                </div>
            )}
        </>
    )
}
