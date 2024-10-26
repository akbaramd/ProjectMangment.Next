export type CreateBoardDto = {
    sprintId: string; // UUID, The sprint to which the board is attached
    name?: string | null; // Nullable as per Swagger
};

export type UpdateBoardDto = {
    name?: string | null; // Nullable as per Swagger
};

export type UpdateBoardColumnDto = {
    name?: string | null; // Nullable as per Swagger
    order?: number | null; // Nullable as per Swagger
};
