import TextComponent from "@/components/common/text/TextComponent";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Gender, Role } from "@/types/user";
import adminUserApi from "@/api/admin/adminUserApi";
import { Alert, Platform, ScrollView, View } from "react-native";
import { isAxiosError } from "axios";
import { twMerge } from "tailwind-merge";
import Title from "@/components/common/title/Title";
import InputGroup from "@/components/common/input/InputGroup";
import SelectGroup from "@/components/common/select/SelectGroup";
import Button from "@/components/common/button/Button";
import ErrorMessage from "@/components/common/form/ErrorMessage";
import {
    AdminUpdateUserInputType,
    adminUpdateUserSchema,
} from "@/schemas/user/adminUpdateUserSchema";
import { useEffect, useState } from "react";
import LoadingIndicator from "@/components/common/loading/LoadingIndicator";

function AdminUpdateUserPage() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const userId = Number(id);
    const router = useRouter();

    const {
        control,
        handleSubmit,
        setError,
        reset,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(adminUpdateUserSchema),
        mode: "onTouched",
        defaultValues: {
            username: "",
            password: "",
            name: "",
            nickname: "",
            email: "",
            phoneNumber: "",
            birthdate: "",
            gender: Gender.MALE,
            role: Role.USER,
        },
    });

    useEffect(() => {
        const loadUser = async () => {
            try {
                const result = await adminUserApi.getUserById(userId);

                let formattedBirthdate;
                if (result.birthdate) {
                    formattedBirthdate = result.birthdate.substring(0, 10).replace(/-/g, "");
                }
                reset({
                    username: result.username,
                    password: "",
                    name: result.name,
                    nickname: result.nickname,
                    email: result.email,
                    phoneNumber: result.phoneNumber || "",
                    birthdate: formattedBirthdate,
                    gender: result.gender,
                    role: result.role,
                });
            } catch (error) {
                console.log(error);
                if (Platform.OS === "web") {
                    alert("사용자 정보를 불러오는데 실패했습니다.");
                    router.push("/admin/users");
                } else {
                    Alert.alert("오류", "사용자 정보를 불러오는데 실패했습니다.", [
                        { text: "확인", onPress: () => router.push("/admin/users") },
                    ]);
                }
            } finally {
                setIsLoading(false);
            }
        };
        loadUser().then(() => {});
    }, [router, userId, reset]);

    const onSubmit = async (input: AdminUpdateUserInputType) => {
        try {
            const { phoneNumber, birthdate, password,...prevInput } = input;

            let formattedDate;
            if (birthdate && birthdate.length === 8) {
                const year = birthdate.slice(0, 4);
                const month = birthdate.slice(4, 6);
                const day = birthdate.slice(6, 8);
                formattedDate = `${year}-${month}-${day}`;
            } else {
                formattedDate = undefined;
            }

            await adminUserApi.updateUser(userId, {
                ...prevInput,
                password: password || undefined,
                phoneNumber: phoneNumber || undefined,
                birthdate: formattedDate,
            });

            if (Platform.OS === "web") {
                alert("사용자 정보를 성공적으로 변경했습니다.");
                router.push("/admin/users");
            } else {
                Alert.alert("수정 완료", "사용자 정보를 성공적으로 변경했습니다.", [
                    { text: "확인", onPress: () => router.push("/admin/users") },
                ]);
            }
        } catch (error) {
            console.log(error);

            if (isAxiosError(error) && error.response) {
                const errorMessage = error.response.data.errorMessage;
                if (error.response.status === 409) {
                    if (errorMessage.includes("아이디")) {
                        setError("username", { message: errorMessage });
                    } else if (errorMessage.includes("닉네임")) {
                        setError("nickname", { message: errorMessage });
                    } else if (errorMessage.includes("email")) {
                        setError("email", { message: errorMessage });
                    } else {
                        setError("root", { message: errorMessage });
                    }
                    return;
                }
                setError("root", { message: errorMessage });
            } else {
                setError("root", { message: "알수 없는 오류가 발생했습니다." });
            }
        }
    };

    if (isLoading) {
        return <LoadingIndicator fullScreen />;
    }

    return (
        <View className={twMerge("flex-1", "w-full")}>
            <Title
                title={"유저 정보 변경"}
                description={"가입된 유저의 정보를 수정합니다."}></Title>
            <ScrollView
                className={twMerge(
                    ["flex-1", "p-6"],
                    ["bg-background-paper", "rounded-xl", "border", "border-divider"],
                )}>
                <TextComponent className={twMerge("mb-4", ["text-lg", "font-bold"])}>
                    계정정보
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
                                onChangeText={onChange} // HTML onChange 속성 => React-Native onChangeText 속성
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
                                label={"비밀번호"}
                                placeholder={"6자 이상 입력해주세요."}
                                onBlur={onBlur}
                                onChangeText={onChange}
                                secureTextEntry={true}
                                value={value}
                                errorMessage={errors.password?.message}
                            />
                        );
                    }}
                />

                <Controller
                    control={control}
                    name={"email"}
                    render={({ field: { onChange, onBlur, value } }) => {
                        return (
                            <InputGroup
                                id={"email"}
                                label={"이메일"}
                                placeholder={"이메일을 입력해주세요."}
                                keyboardType={"email-address"}
                                autoCapitalize={"none"}
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                                errorMessage={errors.email?.message}
                            />
                        );
                    }}
                />

                <View className={twMerge("border-b", "border-divider", "my-6")}></View>

                <TextComponent className={twMerge("mb-4", ["text-lg", "font-bold"])}>
                    개인 정보
                </TextComponent>

                <View className={twMerge("flex-col", "md:flex-row", "md:gap-4")}>
                    <Controller
                        control={control}
                        name={"name"}
                        render={({ field: { onChange, onBlur, value } }) => {
                            return (
                                <InputGroup
                                    wrap={true}
                                    id={"name"}
                                    label={"이름"}
                                    placeholder={"실명 입력"}
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    errorMessage={errors.name?.message}
                                />
                            );
                        }}
                    />
                    <Controller
                        control={control}
                        name={"nickname"}
                        render={({ field: { onChange, onBlur, value } }) => {
                            return (
                                <InputGroup
                                    wrap={true}
                                    id={"nickname"}
                                    label={"닉네임"}
                                    placeholder={"서비스에서 사용할 닉네임 2~10자"}
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    errorMessage={errors.nickname?.message}
                                />
                            );
                        }}
                    />
                </View>

                <View className={twMerge("flex-col", "md:flex-row", "md:gap-4")}>
                    <Controller
                        control={control}
                        name={"phoneNumber"}
                        render={({ field: { onChange, onBlur, value } }) => {
                            return (
                                <InputGroup
                                    wrap={true}
                                    id={"phoneNumber"}
                                    label={"전화번호(선택)"}
                                    placeholder={"010-0000-0000"}
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    keyboardType={"phone-pad"}
                                    errorMessage={errors.phoneNumber?.message}
                                />
                            );
                        }}
                    />
                    <Controller
                        control={control}
                        name={"birthdate"}
                        render={({ field: { onChange, onBlur, value } }) => {
                            return (
                                <InputGroup
                                    wrap={true}
                                    id={"birthdate"}
                                    label={"생년월일 (선택)"}
                                    placeholder={"YYYYMMDD (예: 19951225)"}
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    keyboardType={"number-pad"}
                                    maxLength={8}
                                    errorMessage={errors.birthdate?.message}
                                />
                            );
                        }}
                    />
                </View>

                <View className={twMerge("border-b", "border-divider", "my-6")}></View>
                <TextComponent className={twMerge("mb-4", ["text-lg", "font-bold"])}>
                    권한 및 성별
                </TextComponent>

                <View className={twMerge("flex-col", "md:flex-row", "md:gap-4")}>
                    <Controller
                        control={control}
                        name="gender"
                        render={({ field: { onChange, value } }) => {
                            return (
                                <SelectGroup
                                    options={[
                                        { label: "남성", value: "MALE" },
                                        { label: "여성", value: "FEMALE" },
                                    ]}
                                    label="성별"
                                    placeholder="성별을 선택해주세요"
                                    value={value}
                                    onSelect={onChange}
                                    errorMessage={errors.gender?.message}
                                    wrap={true}
                                />
                            );
                        }}
                    />
                    <Controller
                        control={control}
                        name="role"
                        render={({ field: { onChange, value } }) => {
                            return (
                                <SelectGroup
                                    options={[
                                        { label: "관리자 (ADMIN)", value: "ADMIN" },
                                        { label: "사용자 (USER)", value: "USER" },
                                    ]}
                                    label="권한 설정"
                                    placeholder="권한을 선택해주세요"
                                    value={value}
                                    onSelect={onChange}
                                    errorMessage={errors.role?.message}
                                    wrap={true}
                                />
                            );
                        }}
                    />
                </View>

                {errors.root?.message && (
                    <ErrorMessage className={twMerge("text-center", "mt-2", "mb-4")}>
                        {errors.root?.message}
                    </ErrorMessage>
                )}

                <View
                    className={twMerge(
                        "mt-10",
                        ["flex-row", "justify-end", "items-center"],
                        "gap-3",
                    )}>
                    <Button
                        color={"secondary"}
                        variant={"outlined"}
                        onPress={() => router.push("/admin/users")}>
                        취소
                    </Button>
                    <Button
                        color={"primary"}
                        variant={"contained"}
                        onPress={handleSubmit(onSubmit)}
                        disabled={isSubmitting}>
                        {isSubmitting ? "수정 중..." : "수정"}
                    </Button>
                </View>
            </ScrollView>
        </View>
    );
}

export default AdminUpdateUserPage;
