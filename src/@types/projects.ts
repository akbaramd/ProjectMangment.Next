export interface CreateProjectDto {
    name: string;
    description: string;
    startDate: string;
    tenantId: string;
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

export interface ProjectDetailsDto extends ProjectDto {
    // Add any additional fields for project details
}