import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { AdminCategoryInputType, adminCategorySchema } from "@/schemas/admin/adminCategorySchema";
import { Controller, useForm } from "react-hook-form";
import adminCategoryApi from "@/api/admin/adminCategoryApi";
import { Alert, Platform, View } from "react-native";
import { isAxiosError } from "axios";
import LoadingIndicator from "@/components/common/loading/LoadingIndicator";
import { twMerge } from "tailwind-merge";
import Title from "@/components/common/title/Title";
import Card from "@/components/common/card/Card";
import InputGroup from "@/components/common/input/InputGroup";
import ErrorMessage from "@/components/common/form/ErrorMessage";
import Button from "@/components/common/button/Button";

function AdminCategoryUpdatePage() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const categoryId = Number(id);
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

    const {
        control,
        handleSubmit,
        setError,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<AdminCategoryInputType>({
        resolver: zodResolver(adminCategorySchema),
        mode: "onTouched",
        defaultValues: {
            name: "",
        },
    });

    useEffect(() => {
        const loadCategory = async () => {
            try {
                const data = await adminCategoryApi.getCategoryById(categoryId);
                reset({
                    name: data.name,
                });
            } catch (error) {
                console.log(error);
                if (Platform.OS === "web") {
                    alert("카테고리 정보를 불러오는데 실패했습니다");
                    router.push("/admin/categories");
                } else {
                    Alert.alert("오류", "카테고리 정보를 불러오는데 실패했습니다.");
                    router.push("/admin/categories");
                }
            } finally {
                setIsLoading(false);
            }
        };
        loadCategory().then(() => {});
    }, [reset, router, categoryId]);

    const onSubmit = async (data: AdminCategoryInputType) => {
        try {
            await adminCategoryApi.updateCategory(categoryId, data);
            router.push("/admin/categories");
        } catch (error) {
            console.log(error);
            if (isAxiosError(error) && error.response) {
                if (error.response.status === 409) {
                    setError("name", { message: error.response.data.message });
                    return;
                }
            }
            setError("root", { message: "카테고리 수정 중 알수없는 오류가 발생했습니다." });
        }
    };

    if (isLoading) {
        return <LoadingIndicator fullScreen={true} />;
    }

    return (
        <View className={twMerge("flex-1", "w-full")}>
            <Title
                title={"카테고리 수정"}
                description={"기존 토론장 카테고리의 이름을 수정합니다"}
            />
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
                    <Button
                        variant={"outlined"}
                        color={"secondary"}
                        onPress={() => router.push("/admin/categories")}>
                        취소
                    </Button>
                    <Button
                        variant={"contained"}
                        color={"primary"}
                        onPress={handleSubmit(onSubmit)}
                        disabled={isSubmitting}>
                        {isSubmitting ? "수정중.." : "수정하기"}
                    </Button>
                </View>
            </Card>
        </View>
    );
}

export default AdminCategoryUpdatePage;
