import TextComponent from "@/components/common/text/TextComponent";
import { useRouter } from "expo-router";
import { adminCreateUserSchema } from "@/schemas/user/adminCreateUserSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Gender, Role } from "@/types/user";

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

    return <TextComponent>createUser</TextComponent>;
}

export default AdminCreateUserPage;
