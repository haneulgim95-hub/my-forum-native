import { AdminNoticeInputType } from "@/schemas/notice/adminNoticeSchema";
import axiosInstance from "@/api/axiosInstance";
import { Notice } from "@/types/notice";

const createNotice = async (input: AdminNoticeInputType): Promise<Notice> => {
    const response = await axiosInstance.post("/admin/notice/create", input);
    return response.data.data;
};

export default { createNotice };
