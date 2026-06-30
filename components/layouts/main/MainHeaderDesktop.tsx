import { useRouter } from "expo-router";
import { useThemeStore } from "@/stores/theme/useThemeStore";
import { useAuthStore } from "@/stores/auth/useAuthStore";
import { View } from "react-native";
import { Category } from "@/types/category";

interface Props {
    list: Category[];
}

function MainHeaderDesktop({ list }: Props) {
    const router = useRouter();
    const { theme, onChangeTheme } = useThemeStore();
    const { isLoggedIn, user, logout } = useAuthStore();

    return <View className={"w-full text-center"}>{list ? "불러와짐" : "실패함"}</View>;
}

export default MainHeaderDesktop;
