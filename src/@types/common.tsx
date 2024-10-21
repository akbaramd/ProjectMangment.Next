import type { ReactNode, CSSProperties } from 'react'

export interface CommonProps {
    id?: string
    className?: string
    children?: ReactNode
    style?: CSSProperties
}

export type TableQueries = {
    total?: number
    pageIndex?: number
    pageSize?: number
    query?: string
    sort?: {
        order: 'asc' | 'desc' | ''
        key: string | number
    }
}

export type TraslationFn = (
    key: string,
    fallback?: string | Record<string, string | number>,
) => string

export type Paginated<T> = {
    results: T[];          // Array of items of generic type T
    skip: number;          // Number of items skipped
    take: number;          // Number of items taken (page size)
    page: number;          // Current page number
    totalCount: number;    // Total number of items across all pages
    totalPages: number;    // Total number of pages based on the page size
  };