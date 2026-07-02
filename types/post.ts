import { User } from "@/types/user";

export interface Post {
    id: number;
    title: string;
    content: string;
    views: string;
    categoryId: number;
    userId: number;
    option1Text: string | null;
    option2Text: string | null;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
}

export type PostUser = Pick<User, "id" | "nickname" | "email">

export interface PostListItemType extends Post {
    user: PostUser;
}

export interface PostDetailItemType extends Post {
    user: PostUser;
    vote: {
        option1Count: number;
        option2Count: number;
        totalCount: number;
        hasVoted: boolean;
    }
}
