// src/slices/tenantMemberSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TenantMember } from '@/@types/tenant';
import { fetchTenantMembers, removeTenantMember, updateTenantMemberRole } from './tenantMemberActions';

interface TenantMemberState {
  data: TenantMember[];
  isLoading: boolean;
  error: string | null;
  totalRecords: number;
  currentPage: number;
  rowsPerPage: number;
  searchFilter: string;
  sortField: string;
  sortOrder: 'asc' | 'desc';
  updatingMember: boolean;
  removingMember: boolean;
}

const initialState: TenantMemberState = {
  data: [],
  isLoading: false,
  error: null,
  totalRecords: 0,
  currentPage: 1,
  rowsPerPage: 10,
  searchFilter: '',
  sortField: 'user.fullName',
  sortOrder: 'asc',
  updatingMember: false,
  removingMember: false,
};

const tenantMemberSlice = createSlice({
  name: 'tenantMembers',
  initialState,
  reducers: {
    setCurrentPage(state, action: PayloadAction<number>) {
      state.currentPage = action.payload;
    },
    setRowsPerPage(state, action: PayloadAction<number>) {
      state.rowsPerPage = action.payload;
    },
    setSearchFilter(state, action: PayloadAction<string>) {
      state.searchFilter = action.payload;
      state.currentPage = 1; // Reset to first page when filter changes
    },
    setSorting(state, action: PayloadAction<{ field: string; order: 'asc' | 'desc' }>) {
      state.sortField = action.payload.field;
      state.sortOrder = action.payload.order;
    },
  },
  extraReducers: (builder) => {
    // Fetch Tenant Members
    builder
      .addCase(fetchTenantMembers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTenantMembers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload.results;
        state.totalRecords = action.payload.totalCount;
      })
      .addCase(fetchTenantMembers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch tenant members.';
      });

    // Remove Tenant Member
    builder
      .addCase(removeTenantMember.pending, (state) => {
        state.removingMember = true;
        state.error = null;
      })
      .addCase(removeTenantMember.fulfilled, (state, action) => {
        state.removingMember = false;
        state.data = state.data.filter((member) => member.id !== action.payload);
        state.totalRecords -= 1;
      })
      .addCase(removeTenantMember.rejected, (state, action) => {
        state.removingMember = false;
        state.error = action.payload || 'Failed to remove tenant member.';
      });

    // Update Tenant Member Role
    builder
      .addCase(updateTenantMemberRole.pending, (state) => {
        state.updatingMember = true;
        state.error = null;
      })
      .addCase(updateTenantMemberRole.fulfilled, (state, action) => {
        state.updatingMember = false;
      })
      .addCase(updateTenantMemberRole.rejected, (state, action) => {
        state.updatingMember = false;
        state.error = action.payload || 'Failed to update tenant member role.';
      });
  },
});

export const {
  setCurrentPage,
  setRowsPerPage,
  setSearchFilter,
  setSorting,
} = tenantMemberSlice.actions;

export default tenantMemberSlice.reducer;
