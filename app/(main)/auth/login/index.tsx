import { useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginUserInputType, loginUserSchema } from "@/schemas/user/loginUserSchema";
import { isAxiosError } from "axios";
import userApi from "@/api/user/userApi";
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { twMerge } from "tailwind-merge";
import Card from "@/components/common/card/Card";
import TextComponent from "@/components/common/text/TextComponent";
import InputGroup from "@/components/common/input/InputGroup";
import ErrorMessage from "@/components/common/form/ErrorMessage";
import Button from "@/components/common/button/Button";
import { useAuthStore } from "@/stores/auth/useAuthStore";

function AuthLoginPage() {
    const router = useRouter();
    const { login } = useAuthStore();

    const {
        control,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<LoginUserInputType>({
        resolver: zodResolver(loginUserSchema),
        mode: "onTouched",
        defaultValues: {
            username: "",
            password: "",
        },
    });

    const onSubmit = async (data: LoginUserInputType) => {
        try {
            const result = await userApi.login(data);

            if (result.user && result.token) {
                login(result.user, result.token);
            }

            router.push("/");
        } catch (error) {
            console.log(error);
            let errorMessage = "로그인 중 오류가 발생했습니다.";

            if (isAxiosError(error)) {
                errorMessage = error.response?.data?.message || errorMessage;
            } else if (error instanceof Error) {
                errorMessage = error.message;
            }

            setError("root", { message: errorMessage });
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className={twMerge("flex-1", "bg-background-default")}>
            <ScrollView
                contentContainerClassName={twMerge("p-5", "justify-center", "items-center")}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps={"handled"}>
                <Card className={twMerge("w-full", "max-w-md", "my-8")}>
                    <TextComponent
                        className={twMerge("mb-6", ["text-2xl", "font-bold", "text-center"])}>
                        로그인
                    </TextComponent>

                    <Controller
                        control={control}
                        name={"username"}
                        render={({ field: { onChange, onBlur, value } }) => {
                            return (
                                <InputGroup
                                    id={"username"}
                                    label={"아이디"}
                                    placeholder={"4자 이상 입력해주세요."}
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    errorMessage={errors.username?.message}
                                />
                            );
                        }}
                    />
                    <Controller
                        control={control}
                        name={"password"}
                        render={({ field: { onChange, onBlur, value } }) => {
                            return (
                                <InputGroup
                                    id={"password"}
                                    secureTextEntry={true} // 비밀번호 마스킹 속성
                                    label={"비밀번호"}
                                    placeholder={"6자 이상 입력해주세요."}
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    errorMessage={errors.password?.message}
                                />
                            );
                        }}
                    />

                    {errors.root?.message && (
                        <ErrorMessage className={twMerge("text-center", "mt-2", "mb-4")}>
                            {errors.root?.message}
                        </ErrorMessage>
                    )}

                    <Button
                        color={"primary"}
                        variant={"contained"}
                        size={"large"}
                        fullWidth={true}
                        className={"mt-4"}
                        onPress={handleSubmit(onSubmit)}
                        disabled={isSubmitting}>
                        로그인
                    </Button>
                    <Button
                        color={"secondary"}
                        variant={"outlined"}
                        size={"large"}
                        fullWidth={true}
                        className={"mt-2"}
                        onPress={() => router.push("/auth/register")}>
                        회원가입 하러 가기
                    </Button>
                </Card>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

export default AuthLoginPage;
