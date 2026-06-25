import { z } from "zod";
import { Gender, Role } from "@/types/user";

export const adminCreateUserSchema = z.object({
    username: z.string().min(6, "아이디는 6자 이상 입력해야 합니다."),
    password: z.string().min(6, "비밀번호는 6자 이상 입력해야 합니다."),
    name: z.string().min(2, "이름은 2자 이상 입력해야 합니다."),
    nickname: z
        .string()
        .min(2, "닉네임은 2자 이상 입력해야 합니다.")
        .max(10, "닉네임은 10자 이하로 입력해야 합니다."),
    email: z.email("올바른 이메일 형식에 맞지 않습니다."),
    phoneNumber: z.string().optional().or(z.literal("")),
    birthdate: z
        .string()
        .regex(/^\d{8}$/, "생년월일은 8자리 숫자(YYYYMMDD)로 입력해주세요")
        .optional()
        .or(z.literal("")),
    gender: z.enum(Gender, "성명을 선택해주세요."),
    role: z.enum(Role, "권한을 선택해주세요."),
});

export type AdminCreateUserInputType = z.infer<typeof adminCreateUserSchema>;
