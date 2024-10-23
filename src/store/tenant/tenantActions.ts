// src/actions/tenantActions.ts

import { createAsyncThunk } from '@reduxjs/toolkit';
import { apiGetTenantInfo } from '@/services/TenantService';
import { Tenant } from '@/@types/tenant';

export const fetchTenantInfo = createAsyncThunk<
  Tenant,
  void,
  { rejectValue: string }
>('tenant/fetchTenantInfo', async (_, { rejectWithValue }) => {
  try {
    const response = await apiGetTenantInfo();
    return response;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Failed to fetch tenant info';
    return rejectWithValue(errorMessage);
  }
});
