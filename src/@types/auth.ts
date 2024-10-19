import { b } from "@fullcalendar/core/internal-common"

export type SignInCredential = {
    phoneNumber: string
    password: string
}

export type SignInResponse = {
    accessToken	: string
    userId	: string
    refreshToken	:string
}

export type SignUpResponse = SignInResponse

export type SignUpCredential = {
    fullName?: string | null;
    email?: string | null;
    phoneNumber?: string | null;
    password?: string | null;
}


export type ForgotPassword = {
    email: string
}

export type ResetPassword = {
    password: string
}

export type AuthRequestStatus = 'success' | 'failed' | ''

export type AuthResult = Promise<{
    status: AuthRequestStatus
    message: string
}>

export interface UserDto {
    id: string;
    phoneNumber	: string;
    fullName	: string;
    email: string;
    // Add more fields as needed
}

export type User = {
    id?: string | null;
    phoneNumber?	: string | null;
    fullName?	: string | null;
    email?: string | null;
    permissions: string[] ;
    avatar?: string | null;
    roles?: string[] | null;


}

export type Token = {
    accessToken: string
    refereshToken?: string
}

export type OauthSignInCallbackPayload = {
    onSignIn: (tokens: Token, userId?: string) => void
    redirect: () => void
}
// Permission DTO
export interface PermissionDto {
    key: string;  // Unique permission key (e.g., "document:create")
    name: string; // Human-readable permission name (e.g., "Create Document")
}

// Role DTO
export interface RoleWithPermissionsDto {
    id: string;  // UUID of the role
    name: string; // Name of the role (e.g., "Admin", "Manager")
    title: string; // Name of the role (e.g., "Admin", "Manager")
    deletable: boolean; // Name of the role (e.g., "Admin", "Manager")
    isSystemRole: boolean; // Name of the role (e.g., "Admin", "Manager")
    permissions: PermissionDto[]; // List of permissions associated with the role
}

// Create Role DTO
export interface CreateRoleDto {
    roleName: string;  // Name of the role to be created (e.g., "Editor")
    permissionKeys: string[]; // List of permission keys (e.g., ["document:create", "document:read"])
}

// Update Role DTO
export interface UpdateRoleDto {
    roleName: string;  // Updated name of the role
    permissionKeys: string[]; // List of updated permission keys
}

// Permission Group DTO
export interface PermissionGroupDto {
    key: string;  // Permission group key (e.g., "document", "task")
    name: string; // Name of the permission group (e.g., "Document Operations")
    permissions: PermissionDto[]; // List of permissions within the group
}
