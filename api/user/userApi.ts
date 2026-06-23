import { RegisterUserInputType } from "@/schemas/user/registerUserSchema";
import axiosInstance from "@/api/axiosInstance";
import { User } from "@/types/user";

const registerUser = async (
    data: Omit<RegisterUserInputType, "confirmPassword">,
): Promise<User> => {
    const response = await axiosInstance.post("/user/create", data);
    return response.data;
};

export default { registerUser };
