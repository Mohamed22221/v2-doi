import { useMemo } from 'react'
import { useInfiniteLanguages } from '@/api/hooks/languages'
import { Select } from '@/components/ui'
import type { Language } from '@/api/types/languages'
import { getApiErrorMessage } from '@/api/error'

type SelectOption<TValue extends string = string> = {
  value: TValue
  label: string
}

type LanguageCode = Language['code']

type LanguageSelectProps = {
  value: LanguageCode | null
  onChange: (value: LanguageCode | null) => void
  placeholder?: string
  size?: 'sm' | 'md' | 'lg'
  maxMenuHeight?: number
  isDisabled?: boolean
  loadMoreLabel?: string
  labelFormatter?: (lang: Pick<Language, 'code' | 'name'>) => string
  errorPlaceholder?: string
}

function LanguageSelect({
  value,
  onChange,
  placeholder = 'Select language',
  errorPlaceholder = 'Failed to load languages',
  size = 'sm',
  maxMenuHeight = 300,
  isDisabled = false,
  loadMoreLabel,
  labelFormatter,
}: LanguageSelectProps) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useInfiniteLanguages()

  const languages: Language[] = data?.items ?? []

  const languageOptions = useMemo<SelectOption<LanguageCode>[]>(() => {
    return languages.map((l) => ({
      value: l.code,
      label: labelFormatter ? labelFormatter(l) : l.name,
    }))
  }, [languages, labelFormatter])

  const selectedOption = useMemo<SelectOption<LanguageCode> | null>(() => {
    return languageOptions.find((o) => o.value === value) ?? null
  }, [languageOptions, value])

  const resolvedPlaceholder = useMemo(() => {
    if (!isError) return placeholder

    const apiMessage = getApiErrorMessage(error)
    return apiMessage || errorPlaceholder
  }, [isError, error, placeholder, errorPlaceholder])

  return (
    <Select
      className='min-w-[120px]'
      size={size}
      maxMenuHeight={maxMenuHeight}
      placeholder={resolvedPlaceholder}
      options={languageOptions}
      value={selectedOption}
      hasMore={hasNextPage}
      isLoadingMore={isFetchingNextPage}
      onLoadMore={() => fetchNextPage()}
      onChange={(opt) => onChange(opt?.value ?? null)}
      isLoading={isLoading}
      isDisabled={isDisabled}
      loadMoreLabel={loadMoreLabel}
    />
  )
}

export default LanguageSelect
