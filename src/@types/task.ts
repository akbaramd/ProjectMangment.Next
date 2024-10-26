// Basic Task Models

import { BoardColumnDto, ProjectMemberDto } from "./projects";

export type TaskDto = {
    id: string; // UUID
    title: string | null;
    description?: string | null;
    content?: string | null;
    order: number;
    dueDate?: string | null; // ISO date format
    createdAt: string; // ISO date format
    updatedAt?: string | null; // ISO date format
    boardColumn?: BoardColumnDto | null;
    comments?: TaskCommentDto[] | null;
    assigneeMembers?: ProjectMemberDto[] | null;
}

// Model for creating a new task
export type TaskCreateDto = {
    title: string;
    description?: string;
    content?: string;
    columnId: string; // UUID of the board column
    order: number;
    dueDate?: string; // ISO date format
}

// Model for updating an existing task
export type TaskUpdateDto = {
    title?: string;
    description?: string;
    content?: string;
    order?: number;
    dueDate?: string; 
    boardColumnId?: string; // UUID of the board column
}

// Task Comment Models

export type TaskCommentDto = {
    id: string; // UUID
    taskId: string; // UUID of the related task
    content: string | null;
    createdAt: string; // ISO date format
    projectMember: ProjectMemberDto | null;
}

// Model for creating a task comment
export type TaskCommentCreateDto = {
    content: string;
}

// Model for updating a task comment
export type TaskCommentUpdateDto = {
    content: string;
}



// Model for assigning a member to a task
export type TaskAssigneeDto = {
    memberId: string; // UUID of the project member
    memberName: string | null;
}

