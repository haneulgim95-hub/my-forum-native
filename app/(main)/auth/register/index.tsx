import { useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterUserInputType, registerUserSchema } from "@/schemas/user/registerUserSchema";
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text } from "react-native";
import { twMerge } from "tailwind-merge";
import Card from "@/components/common/card/Card";
import InputGroup from "@/components/common/input/InputGroup";
import ErrorMessage from "@/components/common/form/ErrorMessage";
import Button from "@/components/common/button/Button";
import userApi from "@/api/user/userApi";
import { isAxiosError } from "axios";
import TextComponent from "@/components/common/text/TextComponent";
import SelectGroup from "@/components/common/select/SelectGroup";

function Register() {
    const router = useRouter();

    const {
        control,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<RegisterUserInputType>({
        resolver: zodResolver(registerUserSchema),
        mode: "onTouched",
        defaultValues: {
            username: "",
            password: "",
            confirmPassword: "",
            name: "",
            nickname: "",
            email: "",
            phoneNumber: "",
            birthdate: "",
        },
    });

    const onSubmit = async (data: RegisterUserInputType) => {
        try {
            const { confirmPassword, ...submitData } = data;
            const payload = {
                ...submitData,
                phoneNumber: data.phoneNumber === "" ? undefined : data.phoneNumber,
                birthdate: data.birthdate === "" ? undefined : data.birthdate,
            };
            await userApi.registerUser(payload);

            if (Platform.OS === "web") {
                window.alert("회원가입이 완료되었습니다. 로그인을 진행해주세요.");
                router.push("/auth/login");
            } else {
                // 모바일 환경일 대에는 Alert.alert(제목, 내용, 버튼설정Array) 으로 경고창 출력
                Alert.alert("가입 완료", "회원가입이 완료되었습니다. 로그인을 진행해주세요.", [
                    { text: "확인", onPress: () => router.push("/auth/login") },
                ]);
            }
        } catch (error) {
            console.log(error);
            let errorMessage = "회원가입 중 오류가 발생했습니다.";

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
                        회원가입
                    </TextComponent>

                    <Controller
                        control={control}
                        name={"username"}
                        render={({ field: { onChange, onBlur, value } }) => {
                            return (
                                <InputGroup
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
                                    secureTextEntry={true}
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
                    <Controller
                        control={control}
                        name={"confirmPassword"}
                        render={({ field: { onChange, onBlur, value } }) => {
                            return (
                                <InputGroup
                                    secureTextEntry={true}
                                    label={"비밀번호 확인"}
                                    placeholder={"비밀번호를 다시 입력해주세요."}
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    errorMessage={errors.confirmPassword?.message}
                                />
                            );
                        }}
                    />
                    <Controller
                        control={control}
                        name={"name"}
                        render={({ field: { onChange, onBlur, value } }) => {
                            return (
                                <InputGroup
                                    label={"이름"}
                                    placeholder={"이름을 입력해주세요."}
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
                                    label={"닉네임"}
                                    placeholder={"2자 이상 10자 이내 닉네임을 입력해주세요."}
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    errorMessage={errors.nickname?.message}
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
                                    label={"이메일"}
                                    placeholder={"이메일을 입력해주세요."}
                                    keyboardType={"email-address"}
                                    autoCapitalize={"none"} /* 첫글자 자동 대문자 전환 */
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    errorMessage={errors.email?.message}
                                />
                            );
                        }}
                    />
                    <Controller
                        control={control}
                        name={"phoneNumber"}
                        render={({ field: { onChange, onBlur, value } }) => {
                            return (
                                <InputGroup
                                    label={"전화번호"}
                                    placeholder={"전화번호를 입력해주세요."}
                                    keyboardType={"phone-pad"}
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
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
                                    label={"생년월일"}
                                    placeholder={"YYYYMMDD"}
                                    keyboardType={"number-pad"}
                                    maxLength={8}
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    errorMessage={errors.birthdate?.message}
                                />
                            );
                        }}
                    />

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
                        회원가입
                    </Button>
                    <Button
                        color={"secondary"}
                        variant={"outlined"}
                        size={"large"}
                        fullWidth={true}
                        className={"mt-2"}
                        onPress={() => router.push("/auth/login")}>
                        로그인하러 가기
                    </Button>
                </Card>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

export default Register;
