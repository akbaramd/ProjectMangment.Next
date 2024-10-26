import { TaskDto } from "./task";
import { TenantMember } from "./tenant";

export type CreateProjectDto = {
    name?: string | null;
    description?: string | null;
    startDate: string; // ISO date format, required
};

export type UpdateProjectDto = {
    name?: string | null;
    description?: string | null;
    endDate?: string | null; // ISO date format
};

export type ProjectDto = {
    id: string; // UUID
    name?: string | null;
    description?: string | null;
    startDate: string; // ISO date format, required
    endDate?: string | null; // ISO date format
    tenantId: string; // UUID
    members?: ProjectMemberDto[] | null; // nullable
};

export type ProjectDetailsDto = {
    id: string; // UUID
    name?: string | null;
    description?: string | null;
    startDate: string; // ISO date format
    endDate?: string | null; // ISO date format
    tenantId: string; // UUID
    sprints?: SprintDetailsDto[] | null; // nullable
    members?: ProjectMemberDto[] | null; // nullable
};

export type ProjectMemberDto = {
    id: string; // UUID
    tenantMember: TenantMember | null; // nullable
    access: ProjectMemberAccess | null; // Access property
};

export type ProjectMemberAccess = {
    name?: string | null; // nullable
    id: number; // int32
};



export type BoardColumnDto = {
    id: string; // UUID
    name?: string | null;
    order: number;
};

export type BoardDto = {
    id: string; // UUID
    name?: string | null;
    columns?: BoardColumnDto[] | null; // nullable
};

export type SprintDto = {
    id: string; // UUID
    name?: string | null;
    startDate: string; // ISO date format
    endDate: string; // ISO date format
};

export type SprintDetailsDto = {
    id: string; // UUID
    name?: string | null;
    startDate: string; // ISO date format
    endDate: string; // ISO date format
    boards?: BoardDto[] | null; // nullable
};
