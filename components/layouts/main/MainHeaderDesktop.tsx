import { Link, useRouter } from "expo-router";
import { useThemeStore } from "@/stores/theme/useThemeStore";
import { useAuthStore } from "@/stores/auth/useAuthStore";
import { Pressable, ScrollView, View } from "react-native";
import { Category } from "@/types/category";
import { twMerge } from "tailwind-merge";
import { Ionicons } from "@expo/vector-icons";
import TextComponent from "@/components/common/text/TextComponent";
import { Role } from "@/types/user";
import Button from "@/components/common/button/Button";
import Dropdown from "@/components/common/dropdown/Dropdown";
import { MYPAGE_NAV_LIST } from "@/constants/menu";

interface Props {
    list: Category[];
}

function MainHeaderDesktop({ list }: Props) {
    const router = useRouter();
    const { theme, onChangeTheme } = useThemeStore();
    const { isLoggedIn, user, logout } = useAuthStore();

    const handleLogout = () => {
        logout();
        router.replace("/");
    };

    return (
        <View
            className={twMerge(
                ["bg-background-paper", "border-b", "border-divider"],
                ["w-full", "h-16", "justify-center", "z-50"],
            )}>
            <View
                className={twMerge(
                    ["flex-row", "justify-between", "items-center"],
                    ["w-full", "max-w-7xl", "px-4", "h-full", "mx-auto"],
                )}>
                {/*    로고 영역*/}
                <Link href={"/"} asChild>
                    <Pressable className={twMerge("flex-row", "items-center", "gap-2")}>
                        <Ionicons name={"chatbubbles"} size={26} className={"text-primary-main"} />
                        <TextComponent
                            className={twMerge("text-xl", "font-extrabold", "text-primary-main")}>
                            토론대난투
                        </TextComponent>
                    </Pressable>
                </Link>
                {/*    메뉴 영역*/}
                <View
                    className={twMerge(["flex-1", "flex-row", "items-center"], ["px-8", "gap-6"])}>
                    <Dropdown
                        trigger={
                            <View className={twMerge(["flex-row", "items-center"])}>
                                <TextComponent
                                    className={twMerge(
                                        ["font-bold", "hover:text-primary-main"],
                                        "transition-all",
                                    )}>
                                    토론장
                                </TextComponent>
                                <Ionicons
                                    name={"chevron-down"}
                                    size={16}
                                    className={twMerge("ml-1", "text-text-secondary")}
                                />
                            </View>
                        }>
                        {close => (
                            <ScrollView
                                className={twMerge(["w-48", "max-h-[300px]", "py-2"])}
                                showsVerticalScrollIndicator={true}>
                                {list.length === 0 && (
                                    <View className={twMerge("px-4", "py-3")}>
                                        <TextComponent
                                            className={twMerge(["text-sm", "text-text-secondary"])}>
                                            카테고리가 없습니다.
                                        </TextComponent>
                                    </View>
                                )}
                                {list.map((item, index) => (
                                    <Pressable
                                        key={index}
                                        onPress={() => {
                                            close();
                                            router.push(`/categories/${item.id}`);
                                        }}
                                        className={twMerge(
                                            ["px-4", "py-3", "transition-all"],
                                            ["border-b", "border-divider"],
                                            ["hover:bg-primary-main"],
                                            index === list.length - 1 && "border-b-0",
                                        )}>
                                        <TextComponent
                                            className={twMerge([
                                                "text-sm",
                                                "font-medium",
                                                "hover:text-primary-contrast",
                                            ])}>
                                            {item.name}
                                        </TextComponent>
                                    </Pressable>
                                ))}
                            </ScrollView>
                        )}
                    </Dropdown>

                    <Link href={"/notices"} asChild>
                        <Pressable>
                            <TextComponent
                                className={twMerge(
                                    ["font-bold", "hover:text-primary-main"],
                                    "transition-all",
                                )}>
                                공지사항
                            </TextComponent>
                        </Pressable>
                    </Link>
                </View>

                {/*    우측 컨트롤 영역 */}
                <View className={twMerge(["flex-row", "items-center", "gap-2"])}>
                    <Pressable
                        onPress={onChangeTheme}
                        className={twMerge([
                            "p-2",
                            "rounded-full",
                            "hover:bg-background-default",
                            "transition-all",
                        ])}>
                        <Ionicons
                            name={theme === "light" ? "sunny" : "moon"}
                            size={22}
                            className={"text-text-default"}
                        />
                    </Pressable>

                    {isLoggedIn ? (
                        <View className={twMerge(["flex-row", "items-center", "gap-3"])}>
                            <Dropdown
                                trigger={
                                    <View
                                        className={twMerge(
                                            ["p-2", "rounded-full", "hover:bg-background-default"],
                                            "transition-all",
                                        )}>
                                        <Ionicons
                                            name={"person-outline"}
                                            size={22}
                                            className={"text-info-main"}
                                        />
                                    </View>
                                }>
                                {close => (
                                    <View className={twMerge("py-2", "w-40")}>
                                        {MYPAGE_NAV_LIST.map((item, index) => (
                                            <View key={item.path}>
                                                {item.isDanger && (
                                                    <View
                                                        className={twMerge([
                                                            "h-[1px]",
                                                            "bg-divider",
                                                            "my-1",
                                                        ])}
                                                    />
                                                )}
                                                <Pressable
                                                    onPress={() => {
                                                        close();
                                                        router.push(item.path);
                                                    }}
                                                    className={twMerge(
                                                        ["px-4", "py-2.5", "transition-all"],
                                                        item.isDanger
                                                            ? ["hover:bg-error-main"]
                                                            : "hover:bg-background-default",
                                                    )}>
                                                    <TextComponent
                                                        className={twMerge(
                                                            ["text-sm", "font-medium"],
                                                            item.isDanger && [
                                                                "text-error-main",
                                                                "hover:text-error-contrast",
                                                            ],
                                                        )}>
                                                        {item.label}
                                                    </TextComponent>
                                                </Pressable>
                                            </View>
                                        ))}
                                    </View>
                                )}
                            </Dropdown>

                            {user?.role === Role.ADMIN && (
                                <Pressable
                                    onPress={() => router.push("/admin")}
                                    className={twMerge(
                                        ["p-2", "rounded-full", "hover:bg-background-default"],
                                        "transition-all",
                                    )}>
                                    <Ionicons
                                        name={"shield"}
                                        size={22}
                                        className={"text-text-default"}
                                    />
                                </Pressable>
                            )}
                            <Button variant={"contained"} color={"error"} onPress={handleLogout}>
                                로그아웃
                            </Button>
                        </View>
                    ) : (
                        <View className={twMerge(["flex-row", "items-center", "gap-2"])}>
                            <Button
                                variant={"text"}
                                color={"primary"}
                                onPress={() => router.push("/auth/login")}>
                                로그인
                            </Button>
                            <Button
                                variant={"contained"}
                                color={"primary"}
                                onPress={() => router.push("/auth/register")}>
                                회원가입
                            </Button>
                        </View>
                    )}
                </View>
            </View>
        </View>
    );
}

export default MainHeaderDesktop;
