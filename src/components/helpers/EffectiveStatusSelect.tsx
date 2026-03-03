import { useTranslation } from 'react-i18next'
import { Select } from '@/components/ui'
import { EffectiveStatus } from '@/api/types/products'
import { getEffectiveStatusOptions } from './effective-status.options'
import classNames from 'classnames'

type EffectiveStatusSelectProps = {
    value: EffectiveStatus | null
    onChange: (value: EffectiveStatus | null) => void
    placeholder?: string
    size?: 'sm' | 'md' | 'lg'
    isClearable?: boolean
    className?: string
    type?: 'all' | 'fixedPrice'
}

const EffectiveStatusSelect = ({
    value,
    onChange,
    placeholder,
    size = 'sm',
    isClearable = true,
    className,
    type = 'all',
}: EffectiveStatusSelectProps) => {
    const { t } = useTranslation()
    const options = getEffectiveStatusOptions(t, type)

    return (
        <Select
            isClearable={isClearable}
            className={classNames(className)}
            size={size}
            placeholder={placeholder || t('fixedPrice.table.filters.allStatus')}
            options={options}
            value={value ? options.find((o) => o.value === value) : null}
            onChange={(opt) =>
                onChange((opt?.value as EffectiveStatus) || null)
            }
        />
    )
}

export default EffectiveStatusSelect
