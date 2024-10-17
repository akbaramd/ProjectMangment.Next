import {
    NAV_ITEM_TYPE_TITLE,
    NAV_ITEM_TYPE_ITEM,
    NAV_ITEM_TYPE_COLLAPSE
} from '@/constants/navigation.constant'

import type { NavigationTree } from '@/@types/navigation'

const navigationConfig: NavigationTree[] = [
    {
        key: 'home',
        path: '/home',
        title: 'Home',
        translateKey: 'nav.home',
        icon: 'home',
        type: NAV_ITEM_TYPE_ITEM,
        authority: [],
        subMenu: [],
    },
    /** Example purpose only, please remove */
    
    {
        key: 'collapseMenu',
        path: '',
        title: 'Tenant Management',
        translateKey: 'nav.tenant',
        icon: 'collapseMenu',
        type: NAV_ITEM_TYPE_COLLAPSE,
        authority: [],
        subMenu: [
            {
                key: 'invitations',
                path: '/invitations',
                title: 'Invitations',
                translateKey: 'nav.invitations',
                icon: 'invitationMenu',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
           
        ],
    },
   
]

export default navigationConfig