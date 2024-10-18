import React, { createContext, useContext, useState, useEffect } from 'react';
import { Tenant } from '@/@types/tenant';
import { apiGetTenantInfo } from '@/services/TenantService';
import useAuth from '@/auth/useAuth';

// Define the shape of the tenant context
interface TenantContextType {
    tenant: Tenant | null;
    loading: boolean;
    error: string | null;
    refreshTenant: () => void;
}

// Create the context with default values
const TenantContext = createContext<TenantContextType>({
    tenant: null,
    loading: true,
    error: null,
    refreshTenant: () => {},
});

// Custom hook to use the tenant context
export const useTenant = () => useContext(TenantContext);

// TenantProvider component that fetches tenant info and provides context
export const TenantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [tenant, setTenant] = useState<Tenant | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const { authenticated } = useAuth(); // Assuming useAuth provides auth state

    const fetchTenantInfo = async () => {
        if (!authenticated) return; // Only fetch if authenticated
        setLoading(true);
        setError(null);
        try {
            const tenantData = await apiGetTenantInfo();
            setTenant(tenantData);
        } catch (err: any) {
            setError('Failed to fetch tenant info');
        } finally {
            setLoading(false);
        }
    };

    // Fetch tenant info only if authenticated
    useEffect(() => {
        if (authenticated) {
            fetchTenantInfo();
        } else {
            setLoading(false); // Skip loading if not authenticated
        }
    }, [authenticated]);

    // Provide a method to refresh tenant info
    const refreshTenant = () => {
        if (authenticated) {
            fetchTenantInfo();
        }
    };

    return (
        <TenantContext.Provider value={{ tenant, loading, error, refreshTenant }}>
            {children}
        </TenantContext.Provider>
    );
};
