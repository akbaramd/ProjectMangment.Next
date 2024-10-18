import { useSessionUser, useToken } from '@/store/authStore'
import type { AxiosError } from 'axios'

// List of response codes that should trigger a logout
const logoutErrorCodes = ['InvalidCredentialsException', 'UnauthorizedException'];
const unauthorizedCode = [401, 419, 440];

const AxiosResponseInterceptorErrorCallback = (error: AxiosError) => {
    const { response } = error;
    const { setToken } = useToken();

    if (response) {
        const { status, data } = response;

        // Check if status code or error code should trigger logout
        // @ts-ignore
        const shouldLogout = unauthorizedCode.includes(status) || (data && logoutErrorCodes.includes(data.code));

        if (shouldLogout) {
            setToken(''); // Clear token
            useSessionUser.getState().setUser({}); // Clear user session
            useSessionUser.getState().setSessionSignedIn(false); // Mark user as signed out
        }
    }

    return Promise.reject(error); // Ensure the error is propagated for further handling
};

export default AxiosResponseInterceptorErrorCallback;
