import { BoardDto, CreateProjectDto, ProjectDetailsDto, ProjectDto, SprintDto, TaskDto, UpdateProjectDto } from '@/@types/projects';
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

// Get sprints for a project
export async function apiGetSprintsByProjectId(projectId: string): Promise<SprintDto[]> {
    return ApiService.fetchAuthorizedDataWithAxios<SprintDto[]>({
        url: `${endpointConfig.getSprintsByProjectId(projectId)}`,
        method: 'get',
    });
}

// Get boards for a sprint
export async function apiGetBoardsBySprintId(sprintId: string): Promise<BoardDto[]> {
    return ApiService.fetchAuthorizedDataWithAxios<BoardDto[]>({
        url: `${endpointConfig.getBoardsBySprintId(sprintId)}`,
        method: 'get',
    });
}

// Get tasks for a board
export async function apiGetTasksByBoardId(boardId: string): Promise<TaskDto[]> {
    return ApiService.fetchAuthorizedDataWithAxios<TaskDto[]>({
        url: `${endpointConfig.getTasksByBoardId(boardId)}`,
        method: 'get',
    });
}
export async function apiGetBoardDetailsById(boardId: string): Promise<BoardDto> {
    return ApiService.fetchAuthorizedDataWithAxios<BoardDto>({
        url: `${endpointConfig.getBoardDetailsById(boardId)}`,
        method: 'get',
    });
}