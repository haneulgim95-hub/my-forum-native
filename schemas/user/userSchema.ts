import { z } from "zod";
import { Gender } from "@/types/user";

export const userSchema = z.object({
    username: z.string().min(4, "아이디는 4자 이상 입력해주세요."),
    name: z.string().min(2, "이름을 정확히 입력해주세요."),
    nickname: z
        .string()
        .min(2, "닉네임을 2자 이상 입려갷주세요.")
        .max(10, "닉네임은 10자 이하로 입력해주세요."),
    email: z.email("올바른 이메일 형식이 아닙니다."),
    phoneNumber: z.string().optional().or(z.literal("")),
    birthdate: z
        .string()
        .regex(/^\d{8}$/, "생년월일은 8자리 숫자(YYYYMMDD)로 입력해주세요")
        .optional()
        .or(z.literal("")),
    gender: z.enum(Gender, "성별을 선택해주세요."),
});
