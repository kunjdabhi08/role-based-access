

export interface ResponseModel<T> {
    success: boolean;
    data: T;
    message: string;
    token?: string;
}