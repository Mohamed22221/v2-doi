import { OrderStatus, OrderType, PaymentStatus } from "@/api/types/orders"
import { useTranslation } from "react-i18next"

export const getOrderTypeLabel = (type?: OrderType) => {
    const { t } = useTranslation()
    switch (type) {
        case 'live_auction': return t('orders.table.type.liveAuction')
        case 'fixed_price': return t('orders.table.type.fixedPrice')
        case 'duration_auction': return t('orders.table.type.durationAuction')
        default: return type
    }
}

export const getOrderStatusLabel = (status?: OrderStatus) => {
    const { t } = useTranslation()
    switch (status) {
        case 'completed': return t('orders.table.orderStatus.completed')
        case 'pending': return t('orders.table.orderStatus.pending')
        case 'confirmed': return t('orders.table.orderStatus.confirmed')
        case 'cancelled': return t('orders.table.orderStatus.cancelled')
        default: return status
    }
}

export const getOrderStatusVariant = (status?: OrderStatus) => {
    switch (status) {
        case 'completed': return 'success'
        case 'pending': return 'warning'
        case 'confirmed': return 'info'
        case 'cancelled': return 'danger'
        default: return 'neutral'
    }
}

export const getPaymentStatusLabel = (status?: PaymentStatus) => {
    const { t } = useTranslation()
    switch (status) {
        case 'paid': return t('orders.table.paymentStatus.paid')
        case 'unpaid': return t('orders.table.paymentStatus.unpaid')
        case 'payment_held': return t('orders.table.paymentStatus.paymentHeld')
        case 'failed': return t('orders.table.paymentStatus.failed')
        default: return status
    }
}

export const getPaymentStatusVariant = (status?: PaymentStatus) => {
    switch (status) {
        case 'paid': return 'success'
        case 'unpaid': return 'danger'
        case 'payment_held': return 'warning'
        case 'failed': return 'danger'
        default: return 'neutral'
    }
}
