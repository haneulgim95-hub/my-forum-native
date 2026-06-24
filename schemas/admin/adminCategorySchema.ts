import { z } from "zod";

export const adminCategorySchema = z.object({
    name: z
        .string()
        .min(1, "카테고리 이름은 필수값입니다.")
        .max(50, "카테고리 이름은 최대 50자까지 가능합니다."),
});

export type AdminCategoryInputType = z.infer<typeof adminCategorySchema>;
