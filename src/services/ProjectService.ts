import { BoardDto, CreateProjectDto, ProjectDetailsDto, ProjectDto, SprintDto, TaskDto, UpdateProjectDto } from '@/@types/projects';
import ApiService from './ApiService';
import endpointConfig from '@/configs/endpoint.config';
import { Paginated } from '@/@types/common';

// Get all projects for a tenant with pagination and search
export async function apiGetProjectsForTenant(take: number, skip: number, search?: string): Promise<Paginated<ProjectDto>> {
    return ApiService.fetchAuthorizedDataWithAxios<Paginated<ProjectDto>>({
        url: endpointConfig.getProjects,
        method: 'get',
        params: {
            take,
            skip,
            search, // Optional search query
        },
    });
}

// Get project details by projectId
export async function apiGetProjectDetails(projectId: string): Promise<ProjectDetailsDto> {
    return ApiService.fetchAuthorizedDataWithAxios<ProjectDetailsDto>({
        url: endpointConfig.getProjectDetails(projectId),
        method: 'get',
    });
}

// Add a new project
export async function apiAddProject(data: CreateProjectDto): Promise<ProjectDto> {
    return ApiService.fetchAuthorizedDataWithAxios<ProjectDto>({
        url: endpointConfig.createProject,
        method: 'post',
        data,
    });
}

// Update an existing project
export async function apiUpdateProject(projectId: string, data: UpdateProjectDto): Promise<ProjectDto> {
    return ApiService.fetchAuthorizedDataWithAxios<ProjectDto>({
        url: endpointConfig.updateProject(projectId),
        method: 'put',
        data,
    });
}

// Delete a project by projectId
export async function apiDeleteProject(projectId: string): Promise<void> {
    return ApiService.fetchAuthorizedDataWithAxios<void>({
        url: endpointConfig.deleteProject(projectId),
        method: 'delete',
    });
}