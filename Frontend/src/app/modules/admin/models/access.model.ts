export interface AccessModel {
    roleId: number;
    screenId: number;
    roleName: string;
    screenName: string;
    accessId: number;
    create: boolean;
    edit: boolean;
    view: boolean;
    delete: boolean;
    childScreens: AccessModel[]
}