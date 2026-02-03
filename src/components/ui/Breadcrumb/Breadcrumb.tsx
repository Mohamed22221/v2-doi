import React from 'react'
import { Link } from 'react-router-dom'
import { HiOutlineChevronRight } from 'react-icons/hi'
import classNames from 'classnames'

export type BreadcrumbItem = {
    label: string
    path?: string
}

export interface BreadcrumbProps {
    items: BreadcrumbItem[]
    className?: string
}

const Breadcrumb = ({ items, className }: BreadcrumbProps) => {
    return (
        <nav className={classNames("flex items-center text-sm font-medium mb-4", className)}>
            {items.map((item, index) => {
                const isLast = index === items.length - 1

                return (
                    <React.Fragment key={index}>
                        {item.path && !isLast ? (
                            <Link
                                to={item.path}
                                className="text-primary-400 hover:text-primary-500 transition-colors"
                            >
                                {item.label}
                            </Link>
                        ) : (
                            <span className={isLast ? 'text-primary-500 font-semibold' : 'text-primary-400'}>
                                {item.label}
                            </span>
                        )}
                        {!isLast && (
                            <div className="mx-2 text-neutral-400 flex items-center pt-0.5 rtl:rotate-180">
                                <HiOutlineChevronRight size={14} />
                            </div>
                        )}
                    </React.Fragment>
                )
            })}
        </nav>
    )
}

export default Breadcrumb
