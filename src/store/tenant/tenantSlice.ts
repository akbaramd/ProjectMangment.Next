// src/slices/tenantSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Tenant } from '@/@types/tenant';
import { fetchTenantInfo } from './tenantActions';

interface TenantState {
  tenantInfo: Tenant | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: TenantState = {
  tenantInfo: null,
  isLoading: false,
  error: null,
};

const tenantSlice = createSlice({
  name: 'tenant',
  initialState,
  reducers: {
    // Add any synchronous actions if needed
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTenantInfo.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTenantInfo.fulfilled, (state, action: PayloadAction<Tenant>) => {
        state.isLoading = false;
        state.tenantInfo = action.payload;
      })
      .addCase(fetchTenantInfo.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch tenant info.';
      });
  },
});

export default tenantSlice.reducer;
