import { useConfig } from '@/components/ui/ConfigProvider'

function useThemeClass() {
    const { themeColor , mode} = useConfig()
    const color = `${themeColor}-500 `
    if (mode === 'dark') {
        return {
            ringTheme: `ring-${themeColor}-200`,
            borderTheme: `border-${themeColor}-200`,
            bgTheme: `bg-${themeColor}-200`,
            textTheme:  `text-${themeColor}-200`,
        }
    }
    return {
        ringTheme: `ring-${color}`,
        borderTheme: `border-${color}`,
        bgTheme: `bg-${color}`,
        textTheme:  `text-${color}`,
    }
}

export default useThemeClass
