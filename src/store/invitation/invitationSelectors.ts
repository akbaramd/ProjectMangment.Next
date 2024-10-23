
import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../configureStore';

export const selectInvitationState = (state: RootState) => state.invitations;

export const selectInvitations = createSelector(
  selectInvitationState,
  (invitations) => invitations.data
);

export const selectIsLoading = createSelector(
  selectInvitationState,
  (invitations) => invitations.isLoading
);
export const selectError = createSelector(
  selectInvitationState,
  (invitations) => invitations.error
);
// Add more selectors as needed
