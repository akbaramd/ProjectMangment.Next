import { UserDto } from '@/@types/auth'

export interface Tenant {
    id: string;
    name: string;
    subdomain: string;
    status: number; // Assuming it's an enum or status code
    currentUserRole: TenantMemberRole;
    members?: TenantMember[];
}

export interface TenantMember {
    userId: string;
    user: UserDto;
    memberRole: TenantMemberRole;
    memberStatus: TenantMemberStatus;
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

export enum TenantMemberRole {
    Owner = 0,
    Manager = 1,
    Employee = 2,
    Administrator = 3,
    Guest = 4
}

export enum TenantMemberStatus {
    Active = 0,
    Inactive = 1,
    Banned = 2
}
