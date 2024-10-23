// src/store.ts
import { configureStore } from '@reduxjs/toolkit';
import invitationReducer from './invitation/invitationSlice';
import tenantReducer from './tenant/tenantSlice';
import tenantMemberReducer from './tenant-member/tenantMemberSlice';
import { useDispatch, TypedUseSelectorHook, useSelector } from 'react-redux';

export const store = configureStore({
  reducer: {
    invitations: invitationReducer,
    tenant: tenantReducer,
    tenantMember: tenantMemberReducer,
    // Add other reducers here
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;