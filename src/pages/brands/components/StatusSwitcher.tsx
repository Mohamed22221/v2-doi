import { getApiErrorMessage } from "@/api/error"
import { useActivateBrand, useDeactivateBrand } from "@/api/hooks/brands"
import { BrandTableRow } from "@/api/types/brands"
import { Notification, Switcher, toast } from "@/components/ui"
import { useTranslation } from "react-i18next"

const StatusSwitcher = ({ row }: { row: BrandTableRow }) => {
    const { t } = useTranslation()
    const { mutate: activate, isPending: isActivating } = useActivateBrand()
    const { mutate: deactivate, isPending: isDeactivating } =
        useDeactivateBrand()
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