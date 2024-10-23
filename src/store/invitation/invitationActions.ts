// src/actions/invitationActions.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import { apiCancelInvitation, apiGetInvitations, apiSendInvitation } from '@/services/InvitationService';
import {  Invitation, SendInvitationRequest } from '@/@types/invitations';
import { RootState } from '../configureStore';
import { Paginated } from '@/@types/common';


export const fetchInvitations = createAsyncThunk<
  Paginated<Invitation>,
  void,
  { state: RootState; rejectValue: string }
>('invitations/fetchInvitations', async (_, { getState, rejectWithValue }) => {
  const state = getState().invitations;
  try {
    const response = await apiGetInvitations(
      state.rowsPerPage,
      (state.currentPage - 1) * state.rowsPerPage,
      state.searchFilter,
      state.sortField,
      state.sortOrder
    );
    return response;
  } catch (error) {
    return rejectWithValue('Failed to fetch invitations');
  }
});


export const sendInvitation = createAsyncThunk<
  void,
  SendInvitationRequest,
  { rejectValue: string }
>('invitations/sendInvitation', async (data, { rejectWithValue }) => {
  try {
    await apiSendInvitation(data);
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Failed to send invitation';
    return rejectWithValue(errorMessage);
  }
});

export const cancelInvitation = createAsyncThunk<
  void,
  string,
  { rejectValue: string }
>('invitations/cancelInvitation', async (invitationId, { rejectWithValue }) => {
  try {
    await apiCancelInvitation(invitationId);
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Failed to cancel invitation';
    return rejectWithValue(errorMessage);
  }
});