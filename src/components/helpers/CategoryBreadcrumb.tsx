import React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

// Types
import { Category, CategoryTranslation } from '@/api/types/categories'

interface Props {
    category?: Category | null
    // Optional: allow passing a custom link builder if needed, otherwise default
    buildCategoryLink?: (c: Category) => string
    // Optional: size variant for text and spacing
    size?: 'sm' | 'md' | 'lg'
    // Optional: orientation for layout direction
    orientation?: 'horizontal' | 'vertical'
}

/**
 * Helper function to extract translated name for a category
 * @param translations - Array of category translations
 * @param lang - Target language code
 * @returns Translated name or null if not found
 */
function getTranslatedName(
    translations: CategoryTranslation[] | undefined,
    lang: string,
): string | null {
    if (!translations?.length) return null

    const exact = translations.find((t) => t.languageCode === lang)
    if (exact?.name) return exact.name

    const fallback = translations[0]
    return fallback?.name || null
}

/**
 * CategoryBreadcrumb component
 * Displays a parent -> child breadcrumb for categories with translation support.
 * Used in tables and detail pages to show category hierarchy.
 */
export const CategoryBreadcrumb: React.FC<Props> = ({
    category,
    buildCategoryLink,
    size = 'md',
    orientation = 'horizontal',
}) => {
    const { t, i18n } = useTranslation()
    const lang = i18n.language

    // Size variants
    const sizeClasses = {
        sm: {
            text: 'text-xs',
            arrow: orientation === 'horizontal' ? 'mx-1' : 'my-1',
        },
        md: {
            text: 'text-sm',
            arrow: orientation === 'horizontal' ? 'mx-2' : 'my-2',
        },
        lg: {
            text: 'text-base',
            arrow: orientation === 'horizontal' ? 'mx-2' : 'my-2',
        },
    }

    // Orientation classes
    const orientationClasses = {
        horizontal: 'flex-row items-center',
        vertical: 'flex-col items-start',
    }

    // Extract parent from nested object
    const parentCategory = category?.parent

    const currentName =
        getTranslatedName(category?.translations, lang) || category?.slug
    const parentName =
        getTranslatedName(parentCategory?.translations, lang) ||
        parentCategory?.slug

    const hasParent = !!parentCategory && !!parentName
    const hasCurrent = !!category && !!currentName

    if (!hasParent && !hasCurrent) {
        return (
            <span className={`${sizeClasses[size].text}`}>
                {t('categories.notFound')}
            </span>
        )
    }

    const toLink = (c: Category | { id: string; slug: string }) =>
        buildCategoryLink
            ? buildCategoryLink(c as Category)
            : `/categories/${c.id}/edit`

    const arrow = (
        <span className={`${sizeClasses[size].arrow} text-gray-400`} aria-hidden>
            <span
                className={`inline-block ${orientation === 'horizontal'
                        ? 'rtl:rotate-180'
                        : 'rotate-90 rtl:rotate-90'
                    }`}
            >
                →
            </span>
        </span>
    )

    return (
        <div
            className={`flex ${orientationClasses[orientation]} ${sizeClasses[size].text}`}
        >
            {hasParent && parentCategory && (
                <Link
                    to={toLink(parentCategory)}
                    className="text-gray-900 dark:text-gray-100 hover:underline"
                >
                    {parentName}
                </Link>
            )}

            {hasParent && hasCurrent && arrow}

            {hasCurrent && category && (
                <Link
                    to={toLink(category)}
                    className="font-medium hover:underline text-gray-900 dark:text-gray-100"
                >
                    {currentName}
                </Link>
            )}
        </div>
    )
}
