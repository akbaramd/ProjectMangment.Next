import ApiService from './ApiService';
import endpointConfig from '@/configs/endpoint.config';
import type {
    CreateRoleDto,
    UpdateRoleDto,
    RoleWithPermissionsDto,
    PermissionGroupDto
} from '@/@types/auth';



// Get Roles for Tenant API
export async function apiGetRolesForTenant(): Promise<RoleWithPermissionsDto[]> {
    return ApiService.fetchAuthorizedDataWithAxios<RoleWithPermissionsDto[]>({
        url: endpointConfig.getRoles,
        method: 'get',
    });
}

// Add Role API
export async function apiAddRole(data: CreateRoleDto): Promise<void> {
    return ApiService.fetchAuthorizedDataWithAxios({
        url: endpointConfig.createRole,
        method: 'post',
        data,
    });
}

// Update Role API
export async function apiUpdateRole(roleId: string, data: UpdateRoleDto): Promise<void> {
    return ApiService.fetchAuthorizedDataWithAxios({
        url: endpointConfig.updateRole(roleId),
        method: 'put',
        data,
    });
}

// Delete Role API
export async function apiDeleteRole(roleId: string): Promise<void> {
    return ApiService.fetchAuthorizedDataWithAxios({
        url: endpointConfig.deleteRole(roleId),
        method: 'delete',
    });
}

// Get Permissions Groups API
export async function apiGetPermissionGroups(): Promise<PermissionGroupDto[]> {
    return ApiService.fetchAuthorizedDataWithAxios<PermissionGroupDto[]>({
        url: endpointConfig.getPermissions,
        method: 'get',
    });
}
