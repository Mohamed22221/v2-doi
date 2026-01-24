import Button from '@/components/ui/Button'
import InputGroup from '@/components/ui/InputGroup'
import useDirection from '@/utils/hooks/useDirection'
import { THEME_ENUM } from '@/constants/theme.constant'
import type { Direction } from '@/@types/theme'
import { useTranslation } from 'react-i18next'

const DirectionSwitcher = ({
    callBackClose,
}: {
    callBackClose?: () => void
}) => {
    const { t } = useTranslation()
    const [direction, updateDirection] = useDirection()

    const dirList = [
        { value: THEME_ENUM.DIR_LTR, label: t('themeConfigurator.direction.ltr') },
        { value: THEME_ENUM.DIR_RTL, label: t('themeConfigurator.direction.rtl') },
    ]

    const onDirChange = (val: Direction) => {
        updateDirection(val)
        callBackClose?.()
    }

    return (
        <InputGroup size="sm">
            {dirList.map((dir) => (
                <Button
                    key={dir.value}
                    active={direction === dir.value}
                    onClick={() => onDirChange(dir.value)}
                >
                    {dir.label}
                </Button>
            ))}
        </InputGroup>
    )
}

export default DirectionSwitcher
