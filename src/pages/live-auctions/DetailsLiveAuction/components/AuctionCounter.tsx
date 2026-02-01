import { useState, useEffect } from 'react'

interface Props {
    endTime: string
}

const AuctionCounter = ({ endTime }: Props) => {
    const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number } | null>(null)

    useEffect(() => {
        const calculateTimeLeft = () => {
            const difference = +new Date(endTime) - +new Date()

            if (difference > 0) {
                setTimeLeft({
                    hours: Math.floor(difference / (1000 * 60 * 60)),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60),
                })
            } else {
                setTimeLeft({ hours: 0, minutes: 0, seconds: 0 })
            }
        }

        calculateTimeLeft()
        const timer = setInterval(calculateTimeLeft, 1000)

        return () => clearInterval(timer)
    }, [endTime])

    if (!timeLeft) return null

    const Box = ({ value, pad = true }: { value: number; pad?: boolean }) => (
        <div className="bg-[#F8EFEA] text-[#B87E60] font-semibold text-lg py-1.5 px-3 rounded-xl min-w-[44px] flex items-center justify-center">
            {pad ? value.toString().padStart(2, '0') : value}
        </div>
    )

    return (
        <div className="flex items-center gap-2">
            <Box value={timeLeft.hours} pad={timeLeft.hours >= 10} />
            <span className="font-bold text-neutral-400">:</span>
            <Box value={timeLeft.minutes} />
            <span className="font-bold text-neutral-400">:</span>
            <Box value={timeLeft.seconds} />
        </div>
    )
}

export default AuctionCounter
