


export interface AccessModel {
    roleId: number;
    screenId: number;
    accesses: boolean[];
    roleName: string;
    screenName: string;
    accessId: number;
    create: boolean;
    edit: boolean;
    view: boolean;
    delete: boolean;
}