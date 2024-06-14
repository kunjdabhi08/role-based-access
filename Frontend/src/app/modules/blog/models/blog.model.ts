export interface BlogModel {
    blogId: number;
    title: string;
    authorName: string;
    authorId: number;
    content: string;
    isPremium: boolean;
    isApproved: boolean;
    createdAt: Date;
}