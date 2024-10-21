export type CreateBoardDto = {
    name: string;
    sprintId: string; // The sprint to which the board is attached
};

export type UpdateBoardDto = {
    name: string;
};
