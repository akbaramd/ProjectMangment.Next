
import { PaginatedList } from '@/@types/tenant';
import ApiService from './ApiService';
import endpointConfig from '@/configs/endpoint.config';
import { TaskCreateDto, TaskUpdateDto, TaskCommentCreateDto, TaskCommentUpdateDto, TaskCommentDto, TaskDto } from '@/@types/task';
import { Paginated } from '@/@types/common';


// Tasks Endpoints

// Create a new task
export async function apiCreateTask(data: TaskCreateDto): Promise<TaskDto> {
    return ApiService.fetchAuthorizedDataWithAxios<TaskDto>({
        url: endpointConfig.createTask,
        method: 'post',
        data,
    });
}

// Get a paginated list of tasks within a sprint
export async function apiGetTasksBySprintId(
    sprintId: string, 
    take: number, 
    skip: number, 
    search?: string, 
    boardId?: string, 
    columnId?: string
): Promise<Paginated<TaskDto>> {
    return ApiService.fetchAuthorizedDataWithAxios<Paginated<TaskDto>>({
        url: endpointConfig.getTasksBySprintId(sprintId),
        method: 'get',
        params: {
            take,
            skip,
            search,
            boardId,
            columnId,
        },
    });
}

// Get task details by taskId
export async function apiGetTaskDetails(taskId: string): Promise<TaskDto> {
    return ApiService.fetchAuthorizedDataWithAxios<TaskDto>({
        url: endpointConfig.getTaskDetails(taskId),
        method: 'get',
    });
}

// Update an existing task
export async function apiUpdateTask(taskId: string, data: TaskUpdateDto): Promise<TaskDto> {
    return ApiService.fetchAuthorizedDataWithAxios<TaskDto>({
        url: endpointConfig.updateTask(taskId),
        method: 'put',
        data,
    });
}

// Delete a task by taskId
export async function apiDeleteTask(taskId: string): Promise<void> {
    return ApiService.fetchAuthorizedDataWithAxios<void>({
        url: endpointConfig.deleteTask(taskId),
        method: 'delete',
    });
}

// Task Comments Endpoints

// Add a comment to a task
export async function apiAddTaskComment(taskId: string, data: TaskCommentCreateDto): Promise<TaskCommentDto> {
    return ApiService.fetchAuthorizedDataWithAxios<TaskCommentDto>({
        url: endpointConfig.addTaskComment(taskId),
        method: 'post',
        data,
    });
}

// Update a comment on a task
export async function apiUpdateTaskComment(
    taskId: string, 
    commentId: string, 
    data: TaskCommentUpdateDto
): Promise<TaskCommentDto> {
    return ApiService.fetchAuthorizedDataWithAxios<TaskCommentDto>({
        url: endpointConfig.updateTaskComment(taskId, commentId),
        method: 'put',
        data,
    });
}

// Delete a comment from a task
export async function apiDeleteTaskComment(taskId: string, commentId: string): Promise<void> {
    return ApiService.fetchAuthorizedDataWithAxios<void>({
        url: endpointConfig.deleteTaskComment(taskId, commentId),
        method: 'delete',
    });
}

// Assign a member to a task
export async function apiAssignTaskMember(taskId: string, memberId: string): Promise<void> {
    return ApiService.fetchAuthorizedDataWithAxios<void>({
        url: endpointConfig.assignTaskMember(taskId, memberId),
        method: 'post',
    });
}

// Unassign a member from a task
export async function apiUnassignTaskMember(taskId: string, memberId: string): Promise<void> {
    return ApiService.fetchAuthorizedDataWithAxios<void>({
        url: endpointConfig.unassignTaskMember(taskId, memberId),
        method: 'delete',
    });
}
