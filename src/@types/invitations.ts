import { Tenant } from '@/@types/tenant';

export interface Invitation {
    id: string; // UUID
    phoneNumber: string;
    tenantId: string; // UUID
    tenant: Tenant;
    createdAt: string; // ISO date format
    acceptedAt?: string | null; // ISO date format, nullable
    expirationDate: string; // ISO date format
    canceledAt?: string | null; // ISO date format, nullable
    status: InvitationStatus; // Enum as an object structure
}

export interface InvitationStatus {
    id: number; // Enum ID (int)
    name: string; // Enum name (string)
}

export interface InvitationDetails {
    invitation: Invitation;
    userExists: boolean; // Whether the user already exists in the system
    // Add other fields as per Swagger specifications
}

export interface SendInvitationRequest {
    phoneNumber: string;
    expirationDuration: string; // Expected format (e.g., "P1D" for 1 day in ISO-8601 duration)
}

export interface UpdateInvitationRequest {
    newExpirationDuration?: string | null; // Nullable if it’s an optional update
    // Add other fields as per Swagger specifications
}

export interface PaginationParams {
    skip: number; // Offset for pagination
    take: number; // Number of items per page
    search?: string | null; // Search term, nullable
    sortBy?: string | null; // Field to sort by, nullable
    sortOrder?: string | null; // Order of sorting (e.g., "asc" or "desc"), nullable
}

export interface PaginatedList<T> {
    results: T[]; // Consistent with Swagger naming
    totalCount: number; // Total count of items
    skip: number; // Current offset
    take: number; // Page size
    totalPages?: number; // Optional, as per Swagger
}
