import { Pressable, View } from "react-native";
import { twMerge } from "tailwind-merge";
import { Link, usePathname } from "expo-router";
import Button from "@/components/common/button/Button";
import { ADMIN_NAV_LIST } from "@/constants/menu";
import { Feather } from "@expo/vector-icons";
import TextComponent from "@/components/common/text/TextComponent";
import { useAuthStore } from "@/stores/auth/useAuthStore";

function AdminAsideDesktop() {
    const pathname = usePathname(); // 현재 사용자가 위치한 주소
    const { user, logout } = useAuthStore();

    return (
        <View
            className={twMerge(
                ["w-[250px]", "h-full", "flex-col", "justify-between"],
                ["bg-background-paper", "border-r", "border-divider"],
            )}>
            <View>
                <Link href={"/admin"} asChild>
                    <Button
                        variant={"text"}
                        color={"primary"}
                        className={"text-xl font-semibold border-b border-divider"}>
                        관리자 센터
                    </Button>
                </Link>

                <View className={"px-3 py-4 gap-1"}>
                    {ADMIN_NAV_LIST.map(item => {
                        // 지금 사용자가 보고있는 화면이 어떤 메뉴에 속하는지 강조
                        const isActive =
                            item.path === "/" ? pathname === "/" : pathname.startsWith(item.path);

                        return (
                            <Link href={item.path} key={item.path} asChild>
                                <Pressable
                                    className={twMerge(
                                        ["flex-row", "items-center", "gap-3", "px-4", "py-3.5"],
                                        ["rounded-xl", "transition-all"],
                                        isActive
                                            ? "bg-primary-main/10"
                                            : "hover:bg-background-default",
                                    )}>
                                    <Feather
                                        name={item.icon as any}
                                        size={18}
                                        className={
                                            isActive ? "text-primary-main" : "text-text-secondary"
                                        }
                                    />
                                    <TextComponent
                                        className={twMerge(
                                            "font-bold",
                                            isActive ? "text-primary-main" : "text-text-default",
                                        )}>
                                        {item.label}
                                    </TextComponent>
                                </Pressable>
                            </Link>
                        );
                    })}
                </View>
            </View>

            <View
                className={twMerge(
                    ["p-4", "m-4"],
                    ["border", "border-divider", "rounded-2xl", "bg-background-default"],
                )}>
                <View className={twMerge("flex-row", "items-center", "gap-3", "mb-3")}>
                    <View
                        className={twMerge(
                            ["justify-center", "items-center"],
                            ["w-10", "h-10", "rounded-full", "bg-primary-main"],
                        )}>
                        <Feather name={"shield"} size={18} color={"white"}></Feather>
                    </View>
                    <View>
                        <TextComponent className={"text-sm font-bold"}>{user?.name}</TextComponent>
                        <TextComponent className={"text-xs text-text-secondary"}>
                            {user?.email}
                        </TextComponent>
                    </View>
                </View>
                <Button variant={"outlined"} color={"error"} fullWidth={true} onPress={logout}>
                    로그아웃
                </Button>
            </View>
        </View>
    );
}

export default AdminAsideDesktop;
