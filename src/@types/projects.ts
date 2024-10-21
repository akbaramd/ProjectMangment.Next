export type CreateProjectDto= {
    name?: string | null;
    description?: string | null;
    startDate?: string| null; // ISO date format
}

export type UpdateProjectDto ={
    name?: string | null;
    description?: string | null;
    endDate?: string | null; // ISO date format
}

export type ProjectDto= {
    id: string; // UUID
    name?: string | null;
    description: string | null;
    startDate: string; // ISO date format
    endDate?: string | null; // ISO date format
    tenantId: string; // UUID
}

export type ProjectDetailsDto= {
    id: string; // UUID
    name?: string | null;
    description: string | null;
    startDate: string; // ISO date format
    endDate?: string | null; // ISO date format
    tenantId: string; // UUID
    sprints: SprintDetailsDto[] | null;
}



export type TaskDto ={
    id: string; // UUID
    title: string | null;
    description?: string | null;
    status: number; // Matches TaskStatus in Swagger
    order: number;
}

export type BoardColumnDto ={
    id: string; // UUID
    name: string | null;
    order: number;
    tasks: TaskDto[] | null;
}

export type BoardDto ={
    id: string; // UUID
    name: string | null;
    columns: BoardColumnDto[] | null;
}

export type SprintDto ={
    id: string; // UUID
    name: string | null;
    startDate: string; // ISO date format
    endDate: string; // ISO date format
  
}

export type SprintDetailsDto ={
    id: string; // UUID
    name: string | null;
    startDate: string; // ISO date format
    endDate: string; // ISO date format
    boards: BoardDto[] | null;
}
