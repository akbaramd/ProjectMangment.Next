// src/slices/projectSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ProjectDto, ProjectDetailsDto } from '@/@types/projects';
import { fetchProjects, fetchProjectDetails, addProject, updateProject, deleteProject } from './projectActions';
import { Paginated } from '@/@types/common';

interface ProjectState {
  projects: Paginated<ProjectDto> | null;
  projectDetails: ProjectDetailsDto | null;
  loading: boolean;
  error: string | null;
  currentPage: number;
  rowsPerPage: number;
  searchFilter: string;
  sortField: string;
  sortOrder: 'asc' | 'desc';
}

const initialState: ProjectState = {
  projects: null,
  loading: false,
  error: null,
  currentPage: 1,
  rowsPerPage: 10,
  searchFilter: '',
  projectDetails: null,
  sortField: 'name', // Default sorting field
  sortOrder: 'asc',
};

const projectSlice = createSlice({
  name: 'projects',
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
    },
    setSorting(state, action: PayloadAction<{ field: string; order: 'asc' | 'desc' }>) {
      state.sortField = action.payload.field;
      state.sortOrder = action.payload.order;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Projects
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action: PayloadAction<Paginated<ProjectDto>>) => {
        state.loading = false;
        state.projects = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch projects';
      })

      // Fetch Project Details
      .addCase(fetchProjectDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjectDetails.fulfilled, (state, action: PayloadAction<ProjectDetailsDto>) => {
        state.loading = false;
        state.projectDetails = action.payload;
      })
      .addCase(fetchProjectDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch project details';
      })

      // Add Project
      .addCase(addProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addProject.fulfilled, (state, action: PayloadAction<ProjectDto>) => {
        state.loading = false;
        state.projects?.results.push(action.payload);
      })
      .addCase(addProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to add project';
      })

      // Update Project
      .addCase(updateProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProject.fulfilled, (state, action: PayloadAction<ProjectDto>) => {
        state.loading = false;
        if (state.projects) {
          const index = state.projects.results.findIndex((p) => p.id === action.payload.id);
          if (index !== -1) {
            state.projects.results[index] = action.payload;
          }
        }
      })
      .addCase(updateProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update project';
      })

      // Delete Project
      .addCase(deleteProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProject.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        if (state.projects) {
          state.projects.results = state.projects.results.filter((p) => p.id !== action.payload);
        }
      })
      .addCase(deleteProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to delete project';
      });
  },
});

export const { setCurrentPage, setRowsPerPage, setSearchFilter, setSorting } = projectSlice.actions;

export default projectSlice.reducer;
