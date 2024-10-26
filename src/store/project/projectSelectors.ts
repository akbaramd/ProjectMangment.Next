// src/selectors/projectSelectors.ts

import { RootState } from '../configureStore';
import { createSelector } from '@reduxjs/toolkit';

export const selectProjectState = (state: RootState) => state.projects;

export const selectProjects = createSelector(
  selectProjectState,
  (projectState) => projectState.projects?.results || []
);

export const selectProjectDetails = createSelector(
  selectProjectState,
  (projectState) => projectState.projectDetails
);

export const selectProjectsLoading = createSelector(
  selectProjectState,
  (projectState) => projectState.loading
);

export const selectProjectsError = createSelector(
  selectProjectState,
  (projectState) => projectState.error
);




export const selectProjectsTotalRecords = createSelector(
  selectProjectState,
  (projectState) => projectState.projects?.totalCount || 0
);

export const selectProjectsCurrentPage = createSelector(
  selectProjectState,
  (projectState) => projectState.currentPage
);

export const selectProjectsRowsPerPage = createSelector(
  selectProjectState,
  (projectState) => projectState.rowsPerPage
);

export const selectProjectsSortField = createSelector(
  selectProjectState,
  (projectState) => projectState.sortField
);

export const selectProjectsSortOrder = createSelector(
  selectProjectState,
  (projectState) => projectState.sortOrder
);

export const selectProjectsSearchFilter = createSelector(
  selectProjectState,
  (projectState) => projectState.searchFilter
);
