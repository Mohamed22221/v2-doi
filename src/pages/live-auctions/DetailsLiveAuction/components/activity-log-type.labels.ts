/**
 * Static mapping for activity log `type` values to i18n keys.
 * Keys are the raw backend values (e.g. 'ITEM_HIDDEN').
 * Values are the i18n translation keys to use with `t()`.
 */
export const ACTIVITY_LOG_TYPE_LABELS: Record<string, string> = {
    ITEM_CREATED: 'liveAuctions.details.logTypes.itemCreated',
    ITEM_SUBMITTED: 'liveAuctions.details.logTypes.itemSubmitted',
    ITEM_APPROVED: 'liveAuctions.details.logTypes.itemApproved',
    ITEM_REJECTED: 'liveAuctions.details.logTypes.itemRejected',
    ITEM_HIDDEN: 'liveAuctions.details.logTypes.itemHidden',
    ITEM_UNHIDDEN: 'liveAuctions.details.logTypes.itemUnhidden',
    ITEM_SCHEDULED: 'liveAuctions.details.logTypes.itemScheduled',
    ITEM_LIVE: 'liveAuctions.details.logTypes.itemLive',
    ITEM_ENDED: 'liveAuctions.details.logTypes.itemEnded',
    ITEM_CANCELLED: 'liveAuctions.details.logTypes.itemCancelled',
    ITEM_REORDERED: 'liveAuctions.details.logTypes.itemReordered',
}

/**
 * Returns the i18n key for a given activity log type.
 * Falls back to the raw type value if no mapping is found.
 */
export const getActivityLogTypeKey = (type: string): string =>
    ACTIVITY_LOG_TYPE_LABELS[type] ?? type
