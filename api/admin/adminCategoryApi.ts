import axiosInstance from "@/api/axiosInstance";
import { Category } from "@/types/category.type";

const getCategoryList = async (): Promise<Category[]> => {
    const response = await axiosInstance.get("/admin/category/list");
    return response.data.data;
};

const toggleCategoryStatus = async (id: number): Promise<Category> => {
    const response = await axiosInstance.patch(`/admin/category/${id}/status`);
    return response.data.data;
};
export default { getCategoryList, toggleCategoryStatus };
