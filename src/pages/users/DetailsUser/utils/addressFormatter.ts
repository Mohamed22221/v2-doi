import { TFunction } from 'i18next'

import { ApiAddress } from '@/api/types/users'
import { getLocalizedValue } from '@/utils/getLocalizedValue'


type Params = {
  address?: ApiAddress
  t: TFunction
}

export function formatFullAddress({ address, t }: Params): string {
  if (!address) return '-'

  const parts = [
    getLocalizedValue({
      entity: address.city,
      fallback: t('address.noCity'),
    }),

        getLocalizedValue({
      entity: address.area,
      fallback: t('address.noArea'),
    }),

    address.buildingNumber
      ? t('address.building', { number: address.buildingNumber })
      : t('address.noBuilding'),

    address.floorNumber
      ? t('address.floor', { number: address.floorNumber })
      : t('address.noFloor'),
  ]

  return parts.join(' , ')
}
