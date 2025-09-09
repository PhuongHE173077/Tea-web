
export interface ApiResponse<T> {
    data: T;
    total: number;
    page: number;
    size: number;
}

export interface ParamRequest {
    page?: number;
    size?: number;
    search?: string;
}