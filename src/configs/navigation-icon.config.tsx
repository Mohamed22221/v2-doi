import {
    HiOutlineColorSwatch,
    HiOutlineDesktopComputer,
    HiOutlineViewGridAdd,
    HiOutlineHome,
    HiOutlineCurrencyDollar,
    HiOutlineSupport,
    HiOutlineCog,
    HiOutlineDatabase,
    HiOutlineChartPie,
    HiOutlineLocationMarker,

} from 'react-icons/hi'
import { GrLanguage } from "react-icons/gr";
import type { JSX } from 'react'
import { Icon } from '@/components/ui';

export type NavigationIcons = Record<string, JSX.Element>

const navigationIcon: NavigationIcons = {
    home: <HiOutlineHome />,
    singleMenu: <HiOutlineViewGridAdd />,
    collapseMenu: <Icon name="navLiveAuctions" />,
    groupSingleMenu: <HiOutlineDesktopComputer />,
    groupCollapseMenu: <HiOutlineColorSwatch />,
    users: <Icon name="navUser" />,
    sellers: <Icon name="navSellers" />,
    categories: <Icon name="navCategories" />,
    brands: <HiOutlineChartPie />,
    models: <HiOutlineDatabase />,
    languages: <GrLanguage />,
    orders: <Icon name="navOrders" />,
    fixedPrice: <Icon name="navFixedPrices" />,
    halls: <Icon name="navHalls" />,
    manageAds: <HiOutlineDatabase />,
    payments: <HiOutlineCurrencyDollar />,
    disputes: <Icon name="navDisputes" />,
    support: <HiOutlineSupport />,
    settings: <HiOutlineCog />,
    location: <Icon name='locationNav' />,
}

export default navigationIcon
