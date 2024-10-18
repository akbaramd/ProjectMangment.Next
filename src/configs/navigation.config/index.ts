import { NAV_ITEM_TYPE_COLLAPSE, NAV_ITEM_TYPE_ITEM } from '@/constants/navigation.constant'
import type { NavigationTree } from '@/@types/navigation'
import { TenantMemberRole } from '@/@types/tenant'

// Function to filter navigation config based on the role
const navigationConfigByRole = (role: TenantMemberRole): NavigationTree[] => {

    // Recursive function to filter submenus
    const filterMenuByRole = (menu: NavigationTree[]): NavigationTree[] => {
        return menu
            .filter(item => {
                // Check if tenantAccess exists and if the role is included, otherwise allow all items
                if (item.tenantAccess) {
                    return item.tenantAccess.includes(role);
                }
                return true; // Include if tenantAccess is not defined
            })
            .map(item => ({
                ...item,
                subMenu: filterMenuByRole(item.subMenu) // Recursively filter subMenu items
            }))
            .filter(item => item.subMenu.length > 0 || item.type === NAV_ITEM_TYPE_ITEM); // Only include collapse menus if they have visible subitems
    };

    // Apply filter to the main navigationConfig
    return filterMenuByRole(navigationConfig);
};

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
        authority: [],
        tenantAccess: [TenantMemberRole.Owner, TenantMemberRole.Manager], // Example tenant access
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
                tenantAccess: [TenantMemberRole.Owner, TenantMemberRole.Manager], // Example tenant access
            },
            {
                key: 'members',
                path: '/members',
                title: 'Members',
                translateKey: 'nav.members',
                icon: 'membersMenu',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
                tenantAccess: [TenantMemberRole.Owner, TenantMemberRole.Manager], // Example tenant access
            },
        ],
    },
];

export { navigationConfig, navigationConfigByRole };
export default   navigationConfig;