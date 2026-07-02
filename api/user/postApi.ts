import axiosInstance from "@/api/axiosInstance";
import { PaginationResponseType } from "@/types/common";
import { Post, PostDetailItemType, PostListItemType } from "@/types/post";
import { PostInputType } from "@/schemas/post/postSchema";

const getPostsByCategory = async (
    categoryId: number,
    page: number,
    size: number,
): Promise<PaginationResponseType<PostListItemType>> => {
    const response = await axiosInstance.get(`/post/list/${categoryId}`, {
        params: {
            page,
            size,
        },
    });
    return response.data.data;
};

const getPostById = async (postId: number): Promise<PostDetailItemType> => {
    const response = await axiosInstance.get(`/post/${postId}`);
    return response.data.data;
};

const createPost = async (input: PostInputType): Promise<Post> => {
    const response = await axiosInstance.post("/post/create", input);
    return response.data.data;
};

const votePost = async (postId: number, option: number): Promise<void> => {
    await axiosInstance.post(`/post/${postId}/vote`, {
        option,
    });
};

const cancelVotePost = async (postId: number) => {
    await axiosInstance.delete(`/post/${postId}/vote`);
};

export default {
    getPostsByCategory,
    getPostById,
    createPost,
    votePost,
    cancelVotePost,
};
