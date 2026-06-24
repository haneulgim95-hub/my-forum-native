import { useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { AdminCategoryInputType, adminCategorySchema } from "@/schemas/admin/adminCategorySchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";
import axiosInstance from "@/api/axiosInstance";
import adminCategoryApi from "@/api/admin/adminCategoryApi";
import { View } from "react-native";
import { twMerge } from "tailwind-merge";
import Title from "@/components/common/title/Title";
import Card from "@/components/common/card/Card";
import InputGroup from "@/components/common/input/InputGroup";
import ErrorMessage from "@/components/common/form/ErrorMessage";
import Button from "@/components/common/button/Button";

function AdminCategoryCreatePage() {
    const router = useRouter();
    const {
        control,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<AdminCategoryInputType>({
        resolver: zodResolver(adminCategorySchema),
        mode: "onTouched",
    });

    const onSubmit = async (data: AdminCategoryInputType) => {
        try {
            await adminCategoryApi.createCategory(data);
            router.push("/admin/categories");
        } catch (error) {
            console.log(error);
            if (isAxiosError(error) && error.response) {
                if (error.response.status === 409) {
                    setError("name", { message: error.response.data.message });
                    return;
                }
            }
            setError("root", { message: "카테고리 생성 중 알수없는 오류가 발생되었습니다." });
        }
    };

    return (
        <View className={twMerge("flex-1", "w-full")}>
            <Title title={"카테고리 생성"} description={"새로운 토론장 카테고리를 추가합니다"} />
            <Card>
                <Controller
                    control={control}
                    name={"name"}
                    render={({ field: { onChange, onBlur, value } }) => {
                        return (
                            <InputGroup
                                id={"name"}
                                label={"카테고리명"}
                                placeholder={"50자 이하로 입력해주세요."}
                                onBlur={onBlur}
                                onChangeText={onChange} // HTML onChange 속성 => React-Native onChangeText 속성
                                value={value}
                                errorMessage={errors.name?.message}
                                onSubmitEditing={handleSubmit(onSubmit)} // 엔터키를 쳤을 때 발동되어야 하는 함수를 넣어줌
                            />
                        );
                    }}
                />

                {errors.root?.message && (
                    <ErrorMessage className={twMerge("text-center", "mt-2", "mb-4")}>
                        {errors.root?.message}
                    </ErrorMessage>
                )}

                <View
                    className={twMerge(
                        ["mt-6"],
                        ["flex-row", "items-center", "justify-end", "gap-3"],
                    )}>
                    <Button variant={"outlined"} color={"secondary"} onPress={() => router.push("/admin/categories")}>
                        취소
                    </Button>
                    <Button
                        variant={"contained"}
                        color={"primary"}
                        onPress={handleSubmit(onSubmit)}
                        disabled={isSubmitting}>
                        {isSubmitting ? "생성중.." : "생성하기"}
                    </Button>
                </View>
            </Card>
        </View>
    );
}

export default AdminCategoryCreatePage;
