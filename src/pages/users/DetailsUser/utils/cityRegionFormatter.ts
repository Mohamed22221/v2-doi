import { TFunction } from 'i18next'

import { ApiAddress } from '@/api/types/users'
import { getLocalizedValue } from '@/utils/getLocalizedValue'


type Params = {
  address?: ApiAddress
  t: TFunction
}

export function formatCityRegion({ address, t }: Params): string {
  if (!address) return '-'

  const city = getLocalizedValue({
    entity: address.city,
    fallback: t('address.noCity'),
  })

  const region = getLocalizedValue({
    entity: address.region,
    fallback: t('address.noRegion'),
  })

  return [city, region].join(' , ')
}
