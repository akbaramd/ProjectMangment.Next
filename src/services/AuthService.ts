import ApiService from './ApiService';
import endpointConfig from '@/configs/endpoint.config';
import type {
    SignInCredential,
    SignUpCredential,
    ForgotPassword,
    ResetPassword,
    SignInResponse,
    SignUpResponse,
    User,
    CreateRoleDto,
    UpdateRoleDto,
    RoleWithPermissionsDto,
    PermissionGroupDto
} from '@/@types/auth';

// Sign In API
export async function apiSignIn(data: SignInCredential): Promise<SignInResponse> {
    return ApiService.fetchDataWithAxios<SignInResponse>({
        url: endpointConfig.authSignIn,
        method: 'post',
        data,
    });
}

// Sign Up API
export async function apiSignUp(data: SignUpCredential): Promise<SignUpResponse> {
    return ApiService.fetchDataWithAxios<SignUpResponse>({
        url: endpointConfig.authSignUp,
        method: 'post',
        data,
    });
}

// Get User Profile API
export async function apiGetUserProfile(): Promise<User> {
    return ApiService.fetchAuthorizedDataWithAxios<User>({
        url: endpointConfig.authProfile,
        method: 'get',
    });
}

// Sign Out API
export async function apiSignOut(): Promise<void> {
    return ApiService.fetchDataWithAxios({
        url: endpointConfig.signOut,
        method: 'post',
    });
}

// Forgot Password API
export async function apiForgotPassword<T>(data: ForgotPassword): Promise<T> {
    return ApiService.fetchDataWithAxios<T>({
        url: endpointConfig.forgotPassword,
        method: 'post',
        data,
    });
}

// Reset Password API
export async function apiResetPassword<T>(data: ResetPassword): Promise<T> {
    return ApiService.fetchDataWithAxios<T>({
        url: endpointConfig.resetPassword,
        method: 'post',
        data,
    });
}

// Refresh Token API
export async function apiRefreshToken(refreshToken: string): Promise<SignInResponse> {
    return ApiService.fetchDataWithAxios<SignInResponse>({
        url: endpointConfig.refreshToken,
        method: 'post',
        data: {
            refreshToken,
        },
    });
}

