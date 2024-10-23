import { NAV_ITEM_TYPE_COLLAPSE, NAV_ITEM_TYPE_ITEM } from '@/constants/navigation.constant'
import type { NavigationTree } from '@/@types/navigation'



// Example navigation config
const navigationConfig: NavigationTree[] = [
    {
        key: 'home',
        path: '/home',
        title: 'صفحه اصلی',
        translateKey: 'nav.home',
        icon: 'home',
        type: NAV_ITEM_TYPE_ITEM,
        authority: [],
        subMenu: [],
    },
    {
        key: 'projectsManagment',
        path: '',
        title: 'مدیریت پروژه ها',
        translateKey: 'nav.tenant',
        icon: 'projectSection',
        type: NAV_ITEM_TYPE_COLLAPSE,
        authority: ["project:read"],
        subMenu: [
            {
                key: 'projects',
                path: '/projects',
                title: 'پروژه ها',
                translateKey: 'nav.projects',
                icon: 'invitationMenu',
                type: NAV_ITEM_TYPE_ITEM,
                authority: ["project:read"],
                subMenu: [],
            },
           
        ],
    },
    {
        key: 'collapseMenu',
        path: '',
        title: 'مدیریت مجموعه',
        translateKey: 'nav.tenant',
        icon: 'tenantSection',
        type: NAV_ITEM_TYPE_COLLAPSE,
        authority: ["tenant:read","invitation:read"],
        subMenu: [
            {
                key: 'invitations',
                path: '/invitations',
                title: 'دعوت نامه ها',
                translateKey: 'nav.invitations',
                icon: 'invitationMenu',
                type: NAV_ITEM_TYPE_ITEM,
                authority: ["invitation:read"],
                subMenu: [],
            },
            {
                key: 'members',
                path: '/members',
                title: 'اعضا',
                translateKey: 'nav.members',
                icon: 'membersMenu',
                type: NAV_ITEM_TYPE_ITEM,
                authority: ["tenant:read"],
                subMenu: [],
            },
            {
                key: 'roles',
                path: '/roles',
                title: 'نقش های کاربری',
                translateKey: 'nav.roles',
                icon: 'rolesMenu',
                type: NAV_ITEM_TYPE_ITEM,
                authority: ["role:read"],
                subMenu: [],
            },
        ],
    },
];

export default   navigationConfig;