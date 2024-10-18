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
