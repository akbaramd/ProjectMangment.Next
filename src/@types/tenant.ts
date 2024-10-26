import { RoleWithPermissionsDto, UserDto } from '@/@types/auth';

export interface Tenant {
    id: string; // UUID
    name?: string | null; // Nullable as per Swagger
    subdomain?: string | null; // Nullable as per Swagger
    status: TenantStatus; // TenantStatus enum object structure
    members?: TenantMember[] | null; // Nullable array
}

export interface TenantMember {
    userId: string; // UUID
    user?: UserDto | null; // Nullable reference
    roles?: RoleWithPermissionsDto[] | null; // Nullable array
    status: TenantMemberStatus; // Enum object structure
}

export interface PaginatedList<T> {
    results: T[]; // Consistent with Swagger naming
    skip: number; // Skipped items for pagination
    take: number; // Items per page
    page: number; // Current page
    totalCount: number; // Total count of items
    totalPages?: number; // Optional total pages, marked as read-only in Swagger
}

export interface PaginationParams {
    skip: number; // Skip count for pagination
    take: number; // Page size
    search?: string; // Search term, nullable
    sortDirection?: string; // Optional sort direction
    sortBy?: string; // Optional field to sort by
}

// Enum structures as objects with id and name properties
export interface TenantMemberStatus {
    id: number; // Enum ID as an integer
    name: string; // Enum name as a string
}

export interface TenantStatus {
    id: number; // Enum ID as an integer
    name: string; // Enum name as a string
}
