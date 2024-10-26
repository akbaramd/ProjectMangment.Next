// src/actions/projectActions.ts

import { createAsyncThunk } from '@reduxjs/toolkit';
import { 
  apiGetProjectsForTenant, 
  apiGetProjectDetails, 
  apiAddProject, 
  apiUpdateProject, 
  apiDeleteProject 
} from '@/services/ProjectService';
import { CreateProjectDto, ProjectDto, UpdateProjectDto, ProjectDetailsDto } from '@/@types/projects';
import { Paginated } from '@/@types/common';

export const fetchProjects = createAsyncThunk<
  Paginated<ProjectDto>,
  { take: number; skip: number; search?: string },
  { rejectValue: string }
>('projects/fetchProjects', async ({ take, skip, search }, { rejectWithValue }) => {
  try {
    const response = await apiGetProjectsForTenant(take, skip, search);
    return response;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Failed to fetch projects';
    return rejectWithValue(errorMessage);
  }
});

export const fetchProjectDetails = createAsyncThunk<
  ProjectDetailsDto,
  string,
  { rejectValue: string }
>('projects/fetchProjectDetails', async (projectId, { rejectWithValue }) => {
  try {
    const response = await apiGetProjectDetails(projectId);
    return response;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Failed to fetch project details';
    return rejectWithValue(errorMessage);
  }
});

export const addProject = createAsyncThunk<
  ProjectDto,
  CreateProjectDto,
  { rejectValue: string }
>('projects/addProject', async (data, { rejectWithValue }) => {
  try {
    const response = await apiAddProject(data);
    return response;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Failed to add project';
    return rejectWithValue(errorMessage);
  }
});

export const updateProject = createAsyncThunk<
  ProjectDto,
  { projectId: string; data: UpdateProjectDto },
  { rejectValue: string }
>('projects/updateProject', async ({ projectId, data }, { rejectWithValue }) => {
  try {
    const response = await apiUpdateProject(projectId, data);
    return response;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Failed to update project';
    return rejectWithValue(errorMessage);
  }
});

export const deleteProject = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>('projects/deleteProject', async (projectId, { rejectWithValue }) => {
  try {
    await apiDeleteProject(projectId);
    return projectId;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Failed to delete project';
    return rejectWithValue(errorMessage);
  }
});
