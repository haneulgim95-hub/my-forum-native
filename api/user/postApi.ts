import axiosInstance from "@/api/axiosInstance";
import { PaginationResponseType } from "@/types/common";
import { PostListItemType } from "@/types/post";

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

export default {
    getPostsByCategory,
};
