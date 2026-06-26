import TextComponent from "@/components/common/text/TextComponent";
import { useRouter } from "expo-router";
import {
    AdminCreateUserInputType,
    adminCreateUserSchema,
} from "@/schemas/user/adminCreateUserSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Gender, Role } from "@/types/user";
import adminUserApi from "@/api/admin/adminUserApi";
import { Alert, Platform } from "react-native";
import { isAxiosError } from "axios";
import errorMessage from "@/components/common/form/ErrorMessage";

function AdminCreateUserPage() {
    const router = useRouter();

    const {
        control,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(adminCreateUserSchema),
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

    const onSubmit = async (input: AdminCreateUserInputType) => {
        try {
            const { phoneNumber, birthdate, ...prevInput } = input;

            let formattedDate;
            if (birthdate && birthdate.length === 8) {
                const year = birthdate.slice(0, 4);
                const month = birthdate.slice(4, 6);
                const day = birthdate.slice(6, 8);
                formattedDate = `${year}-${month}-${day}`;
            } else {
                formattedDate = undefined;
            }

            await adminUserApi.createUser({
                ...prevInput,
                phoneNumber: phoneNumber ?? undefined,
                birthdate: formattedDate,
            });

            if (Platform.OS === "web") {
                alert("사용자를 성공적으로 등록했습니다.");
                router.push("/admin/users");
            } else {
                Alert.alert("생성 완료", "사용자를 성공적으로 등록했습니다.", [
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

    return <TextComponent>createUser</TextComponent>;
}

export default AdminCreateUserPage;
