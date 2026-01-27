import { getApiErrorMessage } from '@/api/error'
import {
    useActivateCategory,
    useDeactivateCategory,
} from '@/api/hooks/categories'
import { CategoryTableRow } from '@/api/types/categories'
import { Notification, Switcher, toast } from '@/components/ui'
import { useTranslation } from 'react-i18next'

const StatusSwitcher = ({ row }: { row: CategoryTableRow }) => {
    const {t} = useTranslation()
    const { mutate: activate, isPending: isActivating } = useActivateCategory()
    const { mutate: deactivate, isPending: isDeactivating } =
        useDeactivateCategory()
    const isPending = isActivating || isDeactivating
    
    const onStatusChange = (checked: boolean) => {
        const mutation = checked ? activate : deactivate

        mutation(row.id.toString(), {
            onSuccess: () => {
                toast.push(
                    <Notification
                        title={t(
                            'categories.update.successSwitch',
                        )}
                        type="success"
                    />,
                )
            },
            onError: (error) => {
                toast.push(
                    <Notification
                        title={getApiErrorMessage(error)}
                        type="danger"
                    />,
                )
            },
        })
    }

    return (
        <Switcher
            checked={row.status === 'active'}
            isLoading={isPending}
            disabled={isPending}
            onChange={onStatusChange}
        />
    )
}
export default StatusSwitcher
