export interface PaginationParams {
    page: number;
    limit: number;
    skip: number;
    sortBy: string;
    sortOrder: "asc" | "desc";
}

export interface PaginationMeta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export interface PaginatedResponse<T> {
    success: boolean;
    message: string;
    meta: PaginationMeta;
    data: T[];
}

export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 10;
export const MAX_LIMIT = 100;

export const parsePaginationParams = (
    query: Record<string, unknown>
): PaginationParams => {
    const page = Math.max(1, Number(query.page) || DEFAULT_PAGE);
    const limit = Math.min(MAX_LIMIT, Math.max(1, Number(query.limit) || DEFAULT_LIMIT));
    const skip = (page - 1) * limit;

    const sortBy = typeof query.sortBy === "string" ? query.sortBy : "createdAt";
    const sortOrder = query.sortOrder === "asc" ? "asc" : "desc";

    return {
        page,
        limit,
        skip,
        sortBy,
        sortOrder,
    };
};

export const buildPaginationMeta = (
    page: number,
    limit: number,
    total: number
): PaginationMeta => {
    const totalPages = Math.ceil(total / limit);
    return {
        page,
        limit,
        total,
        totalPages,
    };
};

export const isValidSortBy = (
    sortBy: string,
    allowedFields: string[]
): boolean => {
    return allowedFields.includes(sortBy);
};
