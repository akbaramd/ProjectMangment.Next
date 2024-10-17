export interface Invitation {
    id: string;
    phoneNumber: string;
    tenantId: string;
    createdAt: string; // ISO date string
    isAccepted: boolean;
    acceptedAt?: string; // ISO date string or null
    expirationDate: string; // ISO date string
    isCanceled: boolean;
    canceledAt?: string; // ISO date string or null
    // Add other fields as necessary
}

export interface InvitationDetails {
    phoneNumber: string;
    tenantId: string;
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
