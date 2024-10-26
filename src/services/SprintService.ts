import { 
    BoardDto, 
    CreateProjectDto, 
    ProjectDetailsDto, 
    ProjectDto, 
    SprintDto, 
    UpdateProjectDto 
} from '@/@types/projects';
import ApiService from './ApiService';
import endpointConfig from '@/configs/endpoint.config';
import { Paginated } from '@/@types/common';
import { TaskDto } from '@/@types/task';


// Sprints Endpoints

// Get paginated sprints for a project
export async function apiGetSprints(projectId: string, take: number, skip: number, search?: string): Promise<Paginated<SprintDto>> {
    return ApiService.fetchAuthorizedDataWithAxios<Paginated<SprintDto>>({
        url: endpointConfig.getSprints,
        method: 'get',
        params: {
            take,
            skip,
            search,
            projectId
        },
    });
}

// Get sprint details by sprintId
export async function apiGetSprintDetails(sprintId: string): Promise<SprintDto> {
    return ApiService.fetchAuthorizedDataWithAxios<SprintDto>({
        url: `${endpointConfig.getSprintDetails(sprintId)}`,
        method: 'get',
    });
}

// Create a new sprint
export async function apiCreateSprint(data: CreateProjectDto): Promise<SprintDto> {
    return ApiService.fetchAuthorizedDataWithAxios<SprintDto>({
        url: endpointConfig.createSprint,
        method: 'post',
        data,
    });
}

// Update an existing sprint
export async function apiUpdateSprint(sprintId: string, data: UpdateProjectDto): Promise<SprintDto> {
    return ApiService.fetchAuthorizedDataWithAxios<SprintDto>({
        url: `${endpointConfig.updateSprint(sprintId)}`,
        method: 'put',
        data,
    });
}

// Delete a sprint by sprintId
export async function apiDeleteSprint(sprintId: string): Promise<void> {
    return ApiService.fetchAuthorizedDataWithAxios<void>({
        url: `${endpointConfig.deleteSprint(sprintId)}`,
        method: 'delete',
    });
}

// Boards and Tasks Endpoints

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

// Get board details by boardId
export async function apiGetBoardDetailsById(boardId: string): Promise<BoardDto> {
    return ApiService.fetchAuthorizedDataWithAxios<BoardDto>({
        url: `${endpointConfig.getBoardDetailsById(boardId)}`,
        method: 'get',
    });
}

