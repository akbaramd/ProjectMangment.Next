import ApiService from './ApiService';
import endpointConfig from '@/configs/endpoint.config';
import { Tenant, TenantMember, TenantMemberRole } from '@/@types/tenant';

// Get tenant information (no pagination needed)
export async function apiGetTenantInfo() {
    return ApiService.fetchAuthorizedDataWithAxios<Tenant>({
        url: endpointConfig.getTenantInfo,
        method: 'get',
    });
}

// Get all tenant members (simple list without pagination)
export async function apiGetTenantMembers() {
    return ApiService.fetchAuthorizedDataWithAxios<TenantMember[]>({
        url: endpointConfig.getTenantMembers,
        method: 'get',
    });
}

// Remove a member from the tenant (Only Owner, Manager, Administrator)
export async function apiRemoveTenantMember(memberId: string) {
    return ApiService.fetchAuthorizedDataWithAxios({
        url: endpointConfig.removeTenantMember(memberId),
        method: 'delete',
    });
}

// Update a tenant member's role (Only Owner, Manager, Administrator)
export async function apiUpdateTenantMemberRole(memberId: string, role: TenantMemberRole) {
    return ApiService.fetchAuthorizedDataWithAxios({
        url: endpointConfig.updateTenantMemberRole(memberId),
        method: 'put',
        data: { role },
    });
}
