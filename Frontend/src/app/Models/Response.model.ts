import { AccessModel } from "../admin/Models/access.model";

export interface ResponseModel<T> {
    success: boolean;
    data: T;
    message: string;
    token?: string;
    permissions: AccessModel[];
}