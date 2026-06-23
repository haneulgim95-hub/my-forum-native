import { create } from "axios";

const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || "";

const api = create({
    baseURL: BASE_URL,
    timeout: 5000,
    withCredentials: true,
});

export default api;

