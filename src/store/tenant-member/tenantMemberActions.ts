// src/actions/tenantMemberActions.ts

import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  apiGetTenantMembers,
  apiRemoveTenantMember,
  apiUpdateTenantMemberRole,
} from '@/services/TenantService';
import { PaginatedList, TenantMember } from '@/@types/tenant';

import { RootState } from '../configureStore';

export const fetchTenantMembers = createAsyncThunk<
  PaginatedList<TenantMember>, // Correct type
  void,
  { state: RootState; rejectValue: string }
>('tenantMembers/fetchTenantMembers', async (_, { getState, rejectWithValue }) => {
  const state = getState().tenantMember;
  try {
    const response = await apiGetTenantMembers({
      take: state.rowsPerPage,
      skip: (state.currentPage - 1) * state.rowsPerPage,
      search: state.searchFilter,
      sortBy: state.sortField,
      sortDirection: state.sortOrder,
    });
    return response;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Failed to fetch tenant members';
    return rejectWithValue(errorMessage);
  }
});

export const removeTenantMember = createAsyncThunk<
  string, // Returns the memberId of the removed member
  string, // Accepts memberId as argument
  { rejectValue: string }
>('tenantMembers/removeTenantMember', async (memberId, { rejectWithValue }) => {
  try {
    await apiRemoveTenantMember(memberId);
    return memberId;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Failed to remove tenant member';
    return rejectWithValue(errorMessage);
  }
});

export const updateTenantMemberRole = createAsyncThunk<
  { memberId: string; role: string },
  { memberId: string; role: string },
  { rejectValue: string }
>('tenantMembers/updateTenantMemberRole', async (data, { rejectWithValue }) => {
  try {
    await apiUpdateTenantMemberRole(data.memberId, data.role);
    return data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Failed to update tenant member role';
    return rejectWithValue(errorMessage);
  }
});
