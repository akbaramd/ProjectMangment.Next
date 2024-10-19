import { CreateProjectDto, ProjectDetailsDto, ProjectDto, UpdateProjectDto } from '@/@types/projects';
import ApiService from './ApiService';
import endpointConfig from '@/configs/endpoint.config';


// Get all projects for a tenant
export async function apiGetProjectsForTenant(): Promise<ProjectDto[]> {
    return ApiService.fetchAuthorizedDataWithAxios<ProjectDto[]>({
        url: endpointConfig.getProjects,
        method: 'get',
    });
}

// Get project details by projectId
export async function apiGetProjectDetails(projectId: string ): Promise<ProjectDetailsDto> {
    return ApiService.fetchAuthorizedDataWithAxios<ProjectDetailsDto>({
        url: endpointConfig.getProjectDetails(projectId),
        method: 'get',
    });
}

// Add a new project
export async function apiAddProject(data: CreateProjectDto): Promise<void> {
    return ApiService.fetchAuthorizedDataWithAxios({
        url: endpointConfig.createProject,
        method: 'post',
        data,
    });
}

// Update an existing project
export async function apiUpdateProject(projectId: string, data: UpdateProjectDto): Promise<void> {
    return ApiService.fetchAuthorizedDataWithAxios({
        url: endpointConfig.updateProject(projectId),
        method: 'put',
        data,
    });
}

// Delete a project by projectId
export async function apiDeleteProject(projectId: string): Promise<void> {
    return ApiService.fetchAuthorizedDataWithAxios({
        url: endpointConfig.deleteProject(projectId),
        method: 'delete',
    });
}
