import { useTranslation } from 'react-i18next'

interface SLACounterProps {
    days: number
    hours: number
    minutes: number
}

const SLACounter = ({ days, hours, minutes }: SLACounterProps) => {
    const { t } = useTranslation()

    const Box = ({ value, pad = true }: { value: number; pad?: boolean }) => (
        <div className="bg-[#F8EFEA] text-[#B87E60] font-semibold text-lg py-1.5 px-3 rounded-xl min-w-[44px] flex items-center justify-center">
            {pad ? value.toString().padStart(2, '0') : value}
        </div>
    )

    return (
        <div className="flex items-center gap-2">
            <Box value={days} pad={days >= 10} />
            <span className="font-bold text-neutral-400">:</span>
            <Box value={hours} />
            <span className="font-bold text-neutral-400">:</span>
            <Box value={minutes} />
        </div>
    )
}

export default SLACounter
