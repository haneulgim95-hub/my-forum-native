import { useLocalSearchParams, useRouter } from "expo-router";
import { PostInputType, postSchema } from "@/schemas/post/postSchema";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, Platform, ScrollView, View } from "react-native";
import postApi from "@/api/user/postApi";
import { twMerge } from "tailwind-merge";
import Button from "@/components/common/button/Button";
import TextComponent from "@/components/common/text/TextComponent";
import Title from "@/components/common/title/Title";
import Card from "@/components/common/card/Card";
import InputGroup from "@/components/common/input/InputGroup";
import TextareaGroup from "@/components/common/textarea/TextareaGroup";

function PostCreatePage() {
    const router = useRouter();
    const { categoryId } = useLocalSearchParams<{ categoryId: string }>();
    const parsedCategoryId = Number(categoryId);

    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<PostInputType>({
        resolver: zodResolver(postSchema),
        mode: "onTouched",
        defaultValues: {
            title: "",
            content: "",
            categoryId: parsedCategoryId,
            option1Text: "",
            option2Text: "",
        },
    });

    const onSubmit = async (data: PostInputType) => {
        try {
            const result = await postApi.createPost(data);
            router.replace(`/posts/${result.id}`);
        } catch (error) {
            console.log(error);
            const msg = "게시글 작성에 실패했습니다.";
            if (Platform.OS === "web") {
                alert(msg);
            } else {
                Alert.alert("오류", msg);
            }
        }
    };

    if (!parsedCategoryId) {
        return (
            <View className={twMerge(["flex-1", "justify-center", "items-center"])}>
                <TextComponent className={twMerge(["text-error-main", "font-medium"], "mb-4")}>
                    잘못된 접근입니다. (카테고리 정보 없음)
                </TextComponent>
                <Button color={"primary"} variant={"contained"} onPress={() => router.back()}>
                    뒤로 가기
                </Button>
            </View>
        );
    }

    return (
        <ScrollView className={twMerge(["flex-1", "w-full"])}>
            <Title
                title={"게시글 작성"}
                description={"새로운 토론 주제를 등록하고 사람들의 의견을 들어보세요."}
            />
            <Card>
                <Controller
                    control={control}
                    name={"title"}
                    render={({ field: { onChange, onBlur, value } }) => {
                        return (
                            <InputGroup
                                id={"title"}
                                label={"제목"}
                                placeholder={"제목을 입력해주세요 (최대 255자)"}
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                                errorMessage={errors.title?.message}
                            />
                        );
                    }}
                />
                <Controller
                    control={control}
                    name={"content"}
                    render={({ field: { onChange, onBlur, value } }) => {
                        return (
                            <TextareaGroup
                                id={"content"}
                                label={"내용"}
                                placeholder={"토론하고 싶은 내용을 자유롭게 작성해주세요."}
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                                errorMessage={errors.content?.message}
                                className={"mb-8"}
                            />
                        );
                    }}
                />

                <View
                    className={twMerge(
                        ["mb-8", "p-5", "bg-red-50"],
                        ["rounded-xl", "border", "border-red-400", "border-dashed"],
                    )}>
                    <TextComponent className={twMerge(["font-bold", "mb-1"])}>
                        투표 선택지 (선택사항)
                    </TextComponent>
                    <TextComponent className={twMerge(["text-xs", "text-text-secondary", "mb-4"])}>
                        투표를 진행하려면 두개의 선택지를 모두 입력해주세요.
                    </TextComponent>

                    <View className={twMerge(["md:flex-row", "gap-4", "md:gap-6"])}>
                        <Controller
                            control={control}
                            name={"option1Text"}
                            render={({ field: { onChange, onBlur, value } }) => {
                                return (
                                    <InputGroup
                                        id={"option1Text"}
                                        placeholder={"선택지 1 (예: 찬성, A)"}
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                        errorMessage={errors.option1Text?.message}
                                        wrap={true}
                                    />
                                );
                            }}
                        />
                        <Controller
                            control={control}
                            name={"option2Text"}
                            render={({ field: { onChange, onBlur, value } }) => {
                                return (
                                    <InputGroup
                                        id={"option2Text"}
                                        placeholder={"선택지 2 (예: 반대, B)"}
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                        errorMessage={errors.option2Text?.message}
                                        wrap={true}
                                    />
                                );
                            }}
                        />
                    </View>
                </View>

                <View
                    className={twMerge(
                        ["flex-row", "justify-end", "items-center", "gap-3"],
                        ["pt-6", "border-t", "border-divider"],
                    )}>
                    <Button variant={"outlined"} color={"secondary"} onPress={() => router.back()}>
                        취소
                    </Button>
                    <Button
                        variant={"contained"}
                        color={"primary"}
                        onPress={handleSubmit(onSubmit)}
                        disabled={isSubmitting}>
                        {isSubmitting ? "등록 중..." : "등록하기"}
                    </Button>
                </View>
            </Card>
        </ScrollView>
    );
}

export default PostCreatePage;
