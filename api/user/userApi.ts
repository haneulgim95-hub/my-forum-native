import { RegisterUserInputType } from "@/schemas/user/registerUserSchema";
import axiosInstance from "@/api/axiosInstance";
import { User } from "@/types/user";
import { LoginUserInputType } from "@/schemas/user/loginUserSchema";

const registerUser = async (
    data: Omit<RegisterUserInputType, "confirmPassword">,
): Promise<User> => {
    const response = await axiosInstance.post("/user/create", data);
    return response.data;
};

const login = async (data: LoginUserInputType): Promise<{ user: User; token: string }> => {
    const response = await axiosInstance.post("/user/login", data);
    return response.data.data;
};

export default { registerUser, login };
