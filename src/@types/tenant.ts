import { RoleWithPermissionsDto, UserDto } from '@/@types/auth'

export interface Tenant {
    id: string;
    name: string;
    subdomain: string;
    status: number; // Assuming it's an enum or status code
    members?: TenantMember[];
}

export interface TenantMember {
    userId: string;
    user: UserDto;
    roles	: RoleWithPermissionsDto[];
    memberStatus	: TenantMemberStatus;
}


export interface PaginatedList<T> {
    items: T[];
    totalCount: number;
    pageSize: number;
    currentPage: number;
}

export interface PaginationParams {
    pageNumber: number;
    pageSize: number;
    search?: string;
}


export enum TenantMemberStatus {
    Active = 0,
    Inactive = 1,
    Banned = 2
}
