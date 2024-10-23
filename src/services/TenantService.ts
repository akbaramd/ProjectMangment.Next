import ApiService from './ApiService';
import endpointConfig from '@/configs/endpoint.config';
import { Tenant, TenantMember } from '@/@types/tenant';
import { Paginated } from '@/@types/common';

// Get tenant information (no pagination needed)
export async function apiGetTenantInfo() {
    return ApiService.fetchAuthorizedDataWithAxios<Tenant>({
        url: endpointConfig.getTenantInfo,
        method: 'get',
    });
}

// Get all tenant members (simple list without pagination)
export async function apiGetTenantMembers(take: number, skip: number, search?: string): Promise<Paginated<TenantMember>> {
    return ApiService.fetchAuthorizedDataWithAxios<Paginated<TenantMember>>({
        url: endpointConfig.getTenantMembers,
        method: 'get',
        params: {
            take,
            skip,
            search, // Optional search query
        },
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
export async function apiUpdateTenantMemberRole(memberId: string, role: string) {
    return ApiService.fetchAuthorizedDataWithAxios({
        url: endpointConfig.updateTenantMemberRole(memberId),
        method: 'put',
        data: { role },
    });
}
