import {
    HiOutlineColorSwatch,
    HiOutlineDesktopComputer,
    HiOutlineTemplate,
    HiOutlineViewGridAdd,
    HiOutlineHome,
    HiOutlineUsers,
    HiOutlineCollection,
    HiOutlineShoppingCart,
    HiOutlineTag,
    HiOutlineCurrencyDollar,
    HiOutlineSupport,
    HiOutlineCog,
    HiOutlineDatabase,
    HiOutlineChartPie,
    HiOutlineExclamationCircle,
    HiOutlineUserGroup
} from 'react-icons/hi'
import { GrLanguage } from "react-icons/gr";
import type { JSX } from 'react'

export type NavigationIcons = Record<string, JSX.Element>

const navigationIcon: NavigationIcons = {
    home: <HiOutlineHome />,
    singleMenu: <HiOutlineViewGridAdd />,
    collapseMenu: <HiOutlineTemplate />,
    groupSingleMenu: <HiOutlineDesktopComputer />,
    groupCollapseMenu: <HiOutlineColorSwatch />,
    users: <HiOutlineUsers />,
    categories: <HiOutlineCollection />,
    brands: <HiOutlineChartPie />,
    models: <HiOutlineDatabase />,
    languages: <GrLanguage />,
    orders: <HiOutlineShoppingCart />,
    fixedPrice: <HiOutlineTag />,
    halls: <HiOutlineUserGroup />,
    manageAds: <HiOutlineDatabase />,
    payments: <HiOutlineCurrencyDollar />,
    disputes: <HiOutlineExclamationCircle />,
    support: <HiOutlineSupport />,
    settings: <HiOutlineCog />,
}

export default navigationIcon
