import AxiosBase from './axios/AxiosBase';
import type { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { TOKEN_NAME_IN_STORAGE } from '@/constants/api.constant';
import { useToken } from '@/store/authStore';

const ApiService = {
  fetchDataWithAxios<Response = unknown, Request = Record<string, unknown>>(
    param: AxiosRequestConfig<Request>,
  ) {
    // Existing implementation remains unchanged
    const updatedParam: AxiosRequestConfig<Request> = { ...param };

    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      const subdomain = getSubdomain(hostname);

      if (subdomain) {
        updatedParam.headers = {
          ...updatedParam.headers,
          'X-Tenant': subdomain,
        };
      }
    }

    return new Promise<Response>((resolve, reject) => {
      AxiosBase(updatedParam)
        .then((response: AxiosResponse<Response>) => {
          resolve(response.data);
        })
        .catch((errors: AxiosError) => {
          reject(errors);
        });
    });
  },

  fetchAuthorizedDataWithAxios<Response = unknown, Request = Record<string, unknown>>(
    param: AxiosRequestConfig<Request>,
  ) {
    const updatedParam: AxiosRequestConfig<Request> = { ...param };

    const accessToken = getAccessToken();

    if (accessToken) {
      updatedParam.headers = {
        ...updatedParam.headers,
        Authorization: `Bearer ${accessToken}`,
      };
    }

    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      const subdomain = getSubdomain(hostname);

      if (subdomain) {
        updatedParam.headers = {
          ...updatedParam.headers,
          'X-Tenant': subdomain,
        };
      }
    }

    return new Promise<Response>((resolve, reject) => {
      AxiosBase(updatedParam)
        .then((response: AxiosResponse<Response>) => {
          resolve(response.data);
        })
        .catch((errors: AxiosError) => {
          reject(errors);
        });
    });
  },
};

function getAccessToken(): string | null | Promise<string | null> {
  const {token} = useToken();
  return token;
}

function getSubdomain(hostname: string): string | null {
  const parts = hostname.split('.');
  console.log(parts);

  if (parts.length === 1) {
    // Hostname has no dots, e.g., 'localhost'
    return null;
  }

  let subdomain: string | null = null;
  let baseDomainParts = 2; // Default base domain is two parts (e.g., example.com)

  // Special case for 'localhost' as TLD
  if (parts[parts.length - 1] === 'localhost') {
    baseDomainParts = 1; // Base domain is one part ('localhost')
  }

  if (parts.length > baseDomainParts) {
    // Extract the subdomain parts
    subdomain = parts.slice(0, -baseDomainParts).join('.');
    // Exclude 'www' if it's the only subdomain
    if (subdomain.toLowerCase() === 'www') {
      return null;
    }
    // Remove 'www.' prefix if present
    if (subdomain.toLowerCase().startsWith('www.')) {
      subdomain = subdomain.slice(4);
    }
    return subdomain;
  }

  return null;
}

export default ApiService;
