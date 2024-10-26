import ApiService from './ApiService';
import endpointConfig from '@/configs/endpoint.config';
import { Tenant, TenantMember, PaginatedList } from '@/@types/tenant';


// Get tenant information (no pagination or query parameters needed)
export async function apiGetTenantInfo(): Promise<Tenant> {
    return ApiService.fetchAuthorizedDataWithAxios<Tenant>({
        url: endpointConfig.getTenantInfo,
        method: 'get',
    });
}

// Get all tenant members with pagination, sorting, and search capabilities
export async function apiGetTenantMembers({
    take,
    skip,
    search,
    sortBy,
    sortDirection
}: {
    take: number;
    skip: number;
    search?: string;
    sortBy?: string;
    sortDirection?: string;
}): Promise<PaginatedList<TenantMember>> {
    return ApiService.fetchAuthorizedDataWithAxios<PaginatedList<TenantMember>>({
        url: endpointConfig.getTenantMembers,
        method: 'get',
        params: {
            take,
            skip,
            search, // Optional search query
            sortBy,
            sortDirection,
        },
    });
}

// Remove a member from the tenant by their ID (Only accessible by Owner, Manager, Administrator)
export async function apiRemoveTenantMember(memberId: string): Promise<void> {
    return ApiService.fetchAuthorizedDataWithAxios<void>({
        url: endpointConfig.removeTenantMember(memberId),
        method: 'delete',
    });
}

// Update a tenant member's role using the member ID and role (Only accessible by Owner, Manager, Administrator)
export async function apiUpdateTenantMemberRole(memberId: string, role: string): Promise<void> {
    return ApiService.fetchAuthorizedDataWithAxios<void>({
        url: endpointConfig.updateTenantMemberRole(memberId),
        method: 'put',
        data: { role },
    });
}
