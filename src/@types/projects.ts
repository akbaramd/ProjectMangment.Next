export interface CreateProjectDto {
    name?: string;
    description?: string;
    startDate?: string;
}

export interface UpdateProjectDto {
    name?: string;
    description?: string;
    endDate?: string;
}

export interface ProjectDto {
    id: string;
    name: string;
    description: string;
    startDate: string;
    endDate?: string;
}

export interface TaskDto {
    id: string;
    name: string;
    description?: string;
    order?: number;
}

export interface BoardColumnDto {
    id: string;
    name: string;
    order: number;
    tasks: TaskDto[];
}

export interface BoardDto {
    id: string;
    name: string;
    columns: BoardColumnDto[];
}

export interface SprintDto {
    id: string;
    name: string;
    startDate: string;
    endDate?: string;
    tasks: TaskDto[];
}

export interface ProjectDetailsDto {
    project: {
        id: string;
        name: string;
        description: string;
        startDate: string;
        endDate?: string;
        tenantId: string;
    };
    sprints: SprintDto[];
    boards: BoardDto[];
}
