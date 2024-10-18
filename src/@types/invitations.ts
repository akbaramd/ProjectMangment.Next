import { Tenant } from '@/@types/tenant'

export interface Invitation {
    id: string;
    phoneNumber: string;
    tenantId: string;
    tenant: Tenant;
    createdAt: string; // ISO date string
    acceptedAt?: string; // ISO date string or null
    expirationDate: string; // ISO date string
    canceledAt?: string; // ISO date string or null
    // Add other fields as necessary
    status : InvitationStatus
}

export enum InvitationStatus {
    Pending = 0,
    Accepted = 1,
    Rejected = 2,
    Cancel = 3
}

export interface InvitationDetails {
    invitation: Invitation;
    userExists: boolean;
    // Add other fields as necessary
}

export interface SendInvitationRequest {
    phoneNumber: string;
    expirationDuration: string; // Format according to your API expectations
}

export interface UpdateInvitationRequest {
    newExpirationDuration?: string;
    // Add other updatable fields if necessary
}

export interface PaginationParams {
    pageNumber: number;
    pageSize: number;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
}

export interface PaginatedList<T> {
    items: T[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
}
