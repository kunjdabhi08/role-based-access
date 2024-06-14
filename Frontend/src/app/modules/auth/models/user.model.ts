

export interface User {
    id: number;
    name: string;
    email: string;
    roleId: number;
    roleName: string;
    authorId?: number;
    isSubscribed?: boolean;
    
}