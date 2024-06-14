import { BlobOptions } from "buffer";



export interface PermissionModel {
    screenId: number,
    create: boolean,
    edit: boolean,
    delete: boolean,
    view: boolean
}