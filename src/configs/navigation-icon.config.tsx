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
    HiOutlineChartPie
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
    languages: <GrLanguage />,
    orders: <HiOutlineShoppingCart />,
    fixedPrice: <HiOutlineTag />,
    manageAds: <HiOutlineDatabase />,
    payments: <HiOutlineCurrencyDollar />,
    support: <HiOutlineSupport />,
    settings: <HiOutlineCog />,
}

export default navigationIcon
