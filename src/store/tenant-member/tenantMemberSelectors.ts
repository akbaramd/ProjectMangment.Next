// src/selectors/tenantMemberSelectors.ts

import { RootState } from '../configureStore';
import { createSelector } from '@reduxjs/toolkit';

export const selectTenantMemberState = (state: RootState) => state.tenantMember;

export const selectTenantMembers = createSelector(
  selectTenantMemberState,
  (state) => state.data
);

export const selectTenantMembersIsLoading = createSelector(
  selectTenantMemberState,
  (state) => state.isLoading
);

export const selectTenantMembersError = createSelector(
  selectTenantMemberState,
  (state) => state.error
);

export const selectTenantMembersTotalRecords = createSelector(
  selectTenantMemberState,
  (state) => state.totalRecords
);

export const selectTenantMembersCurrentPage = createSelector(
  selectTenantMemberState,
  (state) => state.currentPage
);

export const selectTenantMembersRowsPerPage = createSelector(
  selectTenantMemberState,
  (state) => state.rowsPerPage
);

export const selectTenantMembersSearchFilter = createSelector(
  selectTenantMemberState,
  (state) => state.searchFilter
);

export const selectTenantMembersSortField = createSelector(
  selectTenantMemberState,
  (state) => state.sortField
);

export const selectTenantMembersSortOrder = createSelector(
  selectTenantMemberState,
  (state) => state.sortOrder
);

export const selectUpdatingMember = createSelector(
  selectTenantMemberState,
  (state) => state.updatingMember
);

export const selectRemovingMember = createSelector(
  selectTenantMemberState,
  (state) => state.removingMember
);
