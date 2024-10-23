// src/slices/invitationSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Invitation } from '@/@types/invitations';
import { cancelInvitation, fetchInvitations, sendInvitation } from './invitationActions';


interface InvitationState {
  data: Invitation[];
  isLoading: boolean;
  error: string | null;
  totalRecords: number;
  currentPage: number;
  rowsPerPage: number;
  searchFilter: string;
  sortField: string;
  sortOrder: 'asc' | 'desc';
  sendingInvitation: boolean;
  cancellingInvitation: boolean;
  invitationToBeCancelled: Invitation | null;
}

const initialState: InvitationState = {
  data: [],
  isLoading: false,
  error: null,
  totalRecords: 0,
  currentPage: 1,
  rowsPerPage: 5,
  searchFilter: '',
  sortField: 'createdAt',
  sortOrder: 'asc',
  sendingInvitation: false,
  cancellingInvitation: false,
  invitationToBeCancelled: null
};

const invitationSlice = createSlice({
  name: 'invitations',
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
    setInvitationToBeCancelled(state, action: PayloadAction<Invitation | null>) {
      state.invitationToBeCancelled = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Invitations
      .addCase(fetchInvitations.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchInvitations.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload.results;
        state.totalRecords = action.payload.totalCount;
        state.error = null;
      })
      .addCase(fetchInvitations.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch invitations.';
      })
      // Send Invitation
      .addCase(sendInvitation.pending, (state) => {
        state.sendingInvitation = true;
        state.error = null;
      })
      .addCase(sendInvitation.fulfilled, (state) => {
        state.sendingInvitation = false;
        state.error = null;
        // Optionally, you can add the new invitation to the data array if the API returns it
      })
      .addCase(sendInvitation.rejected, (state, action) => {
        state.sendingInvitation = false;
        state.error = action.payload || 'Failed to send invitation.';
      })
      // Cancel Invitation
      .addCase(cancelInvitation.pending, (state) => {
        state.cancellingInvitation = true;
        state.error = null;
      })
      .addCase(cancelInvitation.fulfilled, (state) => {
        state.cancellingInvitation = false;
        state.error = null;
        // Optionally, remove or update the cancelled invitation in the data array
      })
      .addCase(cancelInvitation.rejected, (state, action) => {
        state.cancellingInvitation = false;
        state.error = action.payload || 'Failed to cancel invitation.';
      });
  },
});

export const {
  setCurrentPage,
  setRowsPerPage,
  setSearchFilter,
  setSorting,
  setInvitationToBeCancelled,
} = invitationSlice.actions;

export default invitationSlice.reducer;
