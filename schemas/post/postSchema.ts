import { z } from "zod";

export const postSchema = z
    .object({
        title: z
            .string()
            .min(1, "제목을 입력해주세요.")
            .max(255, "제목은 255자 이내로 작성해주세요."),
        content: z.string().min(1, "내용을 입력해주세요"),
        option1Text: z
            .string()
            .max(50, "투표 선택지 내용은 50자 이하로 입력해주세요.")
            .optional()
            .or(z.literal("")),
        option2Text: z
            .string()
            .max(50, "투표 선택지 내용은 50자 이하로 입력해주세요.")
            .optional()
            .or(z.literal("")),
        categoryId: z.number().positive("유효한 카테고리 ID가 필요합니다."),
    })
    .superRefine((data, ctx) => {
        const isOption1Filled = !!data.option1Text?.trim();
        const isOption2Filled = !!data.option2Text?.trim();

        if (isOption1Filled !== isOption2Filled) {
            ctx.addIssue({
                code: "custom",
                message: "투표를 설정하려면 두 선택지 모두 입력해주세요.",
                path: ["option2Text"],
            });
        }
    });

export type PostInputType = z.infer<typeof postSchema>;
