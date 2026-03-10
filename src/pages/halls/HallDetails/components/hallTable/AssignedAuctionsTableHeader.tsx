import { useTranslation } from 'react-i18next'
import { Button, Icon } from '@/components/ui'
import { HiOutlinePlus } from 'react-icons/hi'

interface TableHeaderProps {
    isDraggable: boolean
    onAddClick: () => void
}

export default function AssignedAuctionsTableHeader({
    isDraggable,
    onAddClick,
}: TableHeaderProps) {
    const { t } = useTranslation()
    if (!isDraggable) return null

    return (
        <>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 px-4 border-b mt-2 border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center flex-shrink-0">
                        <Icon name="bundleList" />
                    </div>
                    <div className="flex flex-col gap-0.5">
                        <h3 className="text-xl font-bold text-[#1E293B] dark:text-gray-100">
                            {t('halls.details.header.title')}
                        </h3>
                        <p className="text-sm text-slate-400 dark:text-gray-400 max-w-[600px]">
                            {t('halls.details.header.subtitle')}
                        </p>
                    </div>
                </div>

                <Button
                    type="button"
                    variant="solid"
                    className="!rounded-xl font-bold px-6 h-11 flex items-center gap-2"
                    icon={
                        <HiOutlinePlus className="text-primary-50 dark:text-primary-100" />
                    }
                    onClick={onAddClick}
                >
                    {t('halls.details.header.addItems')}
                </Button>
            </div>

            <div className="flex items-center gap-4 p-5 mx-5 bg-[#FFFBEB] dark:bg-yellow-900/10 border border-[#FEF3C7] dark:border-yellow-900/20 rounded-2xl mb-3 shadow-sm">
                <Icon
                    name="infoAlert"
                    className="text-yellow-400 w-5 h-5 justify-center items-center"
                />
                <p className="text-[14px] text-neutral-950 dark:text-neutral-200 leading-normal font-semibold">
                    {t('halls.details.banner.draggable')}
                </p>
            </div>
        </>
    )
}
