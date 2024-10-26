import { create } from 'zustand'
import type { Members, Columns } from '../types'

import { BoardColumnDto, BoardDto, ProjectMemberDto } from '@/@types/projects'
import { TaskDto } from '@/@types/task'

type View = 'NEW_COLUMN' | 'TICKET' | 'ADD_MEMBER' | 'NEW_TICKET' | ''

export type ScrumBoardState = {
    columns: BoardColumnDto[]
    tasks: TaskDto[]
    board: BoardDto | null
    ordered: string[]
    boardMembers: ProjectMemberDto[]
    allMembers: ProjectMemberDto[]
    dialogOpen: boolean
    dialogView: View
    ticketId: string
    selectedColumn?: BoardColumnDto | null
}

type ScrumBoardAction = {
    updateOrdered: (payload: string[]) => void
    updateColumns: (payload: BoardColumnDto[]) => void
    updateBoard: (payload: BoardDto) => void
    updateTasks: (payload: TaskDto[]) => void
    updateBoardMembers: (payload: ProjectMemberDto[]) => void
    updateAllMembers: (payload: ProjectMemberDto[]) => void
    openDialog: () => void
    closeDialog: () => void
    resetView: () => void
    updateDialogView: (payload: View) => void
    setSelectedTicketId: (payload: string) => void
    setSelectedColumn: (payload: BoardColumnDto | null) => void
}

const initialState: ScrumBoardState = {
    columns: [],
    ordered: [],
    boardMembers: [],
    allMembers: [],
    board: null,
    dialogOpen: false,
    dialogView: '',
    ticketId: '',
    selectedColumn: null,
    tasks: []
}

export const useScrumBoardStore = create<ScrumBoardState & ScrumBoardAction>(
    (set) => ({
        ...initialState,
        updateOrdered: (payload) =>
            set(() => {
                return { ordered: payload }
            }),
        updateColumns: (payload) => set(() => ({ columns: payload })),
        updateTasks: (payload) => set(() => ({ tasks: payload })),
        updateBoardMembers: (payload) => set(() => ({ boardMembers: payload })),
        updateAllMembers: (payload) => set(() => ({ allMembers: payload })),
        updateBoard: (payload) => set(() => ({ board: payload })),
        openDialog: () => set({ dialogOpen: true }),
        closeDialog: () =>
            set({
                dialogOpen: false,
            }),
        resetView: () =>
            set({
                ticketId: '',
                selectedColumn: null,
                dialogView: '',
            }),
        updateDialogView: (payload) => set(() => ({ dialogView: payload })),
        setSelectedTicketId: (payload) => set(() => ({ ticketId: payload })),
        setSelectedColumn: (payload) => set(() => ({ selectedColumn: payload })),
    }),
)
