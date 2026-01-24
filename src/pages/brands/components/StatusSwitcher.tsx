import { getApiErrorMessage } from "@/api/error"
import { useActivateBrand, useDeactivateBrand } from "@/api/hooks/brands"
import { BrandTableRow } from "@/api/types/brands"
import { Notification, Switcher, toast } from "@/components/ui"

const StatusSwitcher = ({ row }: { row: BrandTableRow }) => {
    const { mutate: activate, isPending: isActivating } = useActivateBrand()
    const { mutate: deactivate, isPending: isDeactivating } =
        useDeactivateBrand()
    const isPending = isActivating || isDeactivating

    const onStatusChange = (checked: boolean) => {
        const mutation = checked ? activate : deactivate

        mutation(row.id.toString(), {
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