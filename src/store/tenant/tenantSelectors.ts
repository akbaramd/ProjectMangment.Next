// src/selectors/tenantSelectors.ts

import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../configureStore';

export const selectTenantState = (state: RootState) => state.tenant;

export const selectTenantInfo = createSelector(
  selectTenantState,
  (state) => state.tenantInfo
);

export const selectTenantIsLoading = createSelector(
  selectTenantState,
  (state) => state.isLoading
);

export const selectTenantError = createSelector(
  selectTenantState,
  (state) => state.error
);
