import { BoardDto,  } from '@/@types/projects';
import ApiService from './ApiService';
import endpointConfig from '@/configs/endpoint.config';
import { Paginated } from '@/@types/common';
import { CreateBoardDto, UpdateBoardColumnDto, UpdateBoardDto } from '@/@types/boards';

// Boards Endpoints

// Get paginated boards
export async function apiGetBoards(take: number, skip: number, search?: string, sprintId?: string): Promise<Paginated<BoardDto>> {
    return ApiService.fetchAuthorizedDataWithAxios<Paginated<BoardDto>>({
        url: endpointConfig.getBoards,
        method: 'get',
        params: {
            take,
            skip,
            search,
            sprintId,
        },
    });
}

// Get board details by boardId
export async function apiGetBoardDetails(boardId: string): Promise<BoardDto> {
    return ApiService.fetchAuthorizedDataWithAxios<BoardDto>({
        url: `${endpointConfig.getBoardDetails(boardId)}`,
        method: 'get',
    });
}

// Create a new board
export async function apiCreateBoard(data: CreateBoardDto): Promise<BoardDto> {
    return ApiService.fetchAuthorizedDataWithAxios<BoardDto>({
        url: endpointConfig.createBoard,
        method: 'post',
        data,
    });
}

// Update an existing board
export async function apiUpdateBoard(boardId: string, data: UpdateBoardDto): Promise<BoardDto> {
    return ApiService.fetchAuthorizedDataWithAxios<BoardDto>({
        url: `${endpointConfig.updateBoard(boardId)}`,
        method: 'put',
        data,
    });
}

// Delete a board by boardId
export async function apiDeleteBoard(boardId: string): Promise<void> {
    return ApiService.fetchAuthorizedDataWithAxios<void>({
        url: `${endpointConfig.deleteBoard(boardId)}`,
        method: 'delete',
    });
}


// Get board details by boardId
export async function apiGetBoardDetailsById(boardId: string): Promise<BoardDto> {
    return ApiService.fetchAuthorizedDataWithAxios<BoardDto>({
        url: `${endpointConfig.getBoardDetailsById(boardId)}`,
        method: 'get',
    });
}


// Update an existing board
export async function apiUpdateBoardColumn(boardId: string, columnId: string, data: UpdateBoardColumnDto): Promise<BoardDto> {
    return ApiService.fetchAuthorizedDataWithAxios<BoardDto>({
        url: `${endpointConfig.updateBoardColumn(boardId,columnId)}`,
        method: 'put',
        data,
    });
}