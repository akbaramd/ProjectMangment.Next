import { NAV_ITEM_TYPE_COLLAPSE, NAV_ITEM_TYPE_ITEM } from '@/constants/navigation.constant'
import type { NavigationTree } from '@/@types/navigation'
import { TenantMemberRole } from '@/@types/tenant'



// Example navigation config
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
    {
        key: 'collapseMenu',
        path: '',
        title: 'Tenant Management',
        translateKey: 'nav.tenant',
        icon: 'collapseMenu',
        type: NAV_ITEM_TYPE_COLLAPSE,
        authority: ["tenant:read","invitation:read"],
        subMenu: [
            {
                key: 'invitations',
                path: '/invitations',
                title: 'Invitations',
                translateKey: 'nav.invitations',
                icon: 'invitationMenu',
                type: NAV_ITEM_TYPE_ITEM,
                authority: ["invitation:read"],
                subMenu: [],
            },
            {
                key: 'members',
                path: '/members',
                title: 'Members',
                translateKey: 'nav.members',
                icon: 'membersMenu',
                type: NAV_ITEM_TYPE_ITEM,
                authority: ["tenant:read"],
                subMenu: [],
            },
        ],
    },
];

export default   navigationConfig;