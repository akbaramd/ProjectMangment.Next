// src/context/TenantProvider.tsx

import React, { createContext, useContext, useEffect } from 'react';
import useAuth from '@/auth/useAuth';
import { Tenant } from '@/@types/tenant';
import { useAppDispatch, useAppSelector } from '@/store/configureStore';
import { fetchTenantInfo } from '@/store/tenant/tenantActions';
import { selectTenantError, selectTenantInfo, selectTenantIsLoading } from '@/store/tenant/tenantSelectors';

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
  const dispatch = useAppDispatch();

  // Select tenant data, loading state, and error from Redux
  const tenant = useAppSelector(selectTenantInfo);
  const loading = useAppSelector(selectTenantIsLoading);
  const error = useAppSelector(selectTenantError);

  const { authenticated } = useAuth();

  useEffect(() => {
    if (authenticated) {
      dispatch(fetchTenantInfo());
    }
  }, [authenticated, dispatch]);

  // Provide a method to refresh tenant info
  const refreshTenant = () => {
    if (authenticated) {
      dispatch(fetchTenantInfo());
    }
  };

  return (
    <TenantContext.Provider value={{ tenant, loading, error, refreshTenant }}>
      {children}
    </TenantContext.Provider>
  );
};
