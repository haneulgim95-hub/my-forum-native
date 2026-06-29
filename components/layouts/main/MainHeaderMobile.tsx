import { useRouter, Link } from "expo-router";
import { useThemeStore } from "@/stores/theme/useThemeStore";
import { useAuthStore } from "@/stores/auth/useAuthStore";
import { useState, useEffect } from "react";
import { Category } from "@/types/category";
import categoryApi from "@/api/user/categoryApi";
import { twMerge } from "tailwind-merge";
import TextComponent from "@/components/common/text/TextComponent";
import { Feather, Ionicons } from "@expo/vector-icons";
import { Modal, Pressable, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MYPAGE_NAV_LIST } from "@/constants/menu";
import { Role } from "@/types/user";
import Button from "@/components/common/button/Button";
import Accordion from "@/components/common/accordion/Accordion";

function MainHeaderMobile() {
    const router = useRouter();
    const { theme, onChangeTheme } = useThemeStore();
    const { isLoggedIn, user, logout } = useAuthStore();

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [list, setList] = useState<Category[]>([]);

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const result = await categoryApi.getCategoryList();
                setList(result);
            } catch (error) {
                console.log(error);
            }
        };
        loadCategories().then(() => {});
    }, []);

    const handleNavigate = (path: string) => {
        setIsMenuOpen(false);
        router.push(path);
    };

    const handleLogout = () => {
        setIsMenuOpen(false);
        logout();
    };

    return (
        <View
            className={twMerge(
                ["w-full", "h-16", "bg-background-paper"],
                ["justify-center"],
                ["border-b", "border-divider"],
            )}>
            <View
                className={twMerge(
                    ["flex-row", "justify-between", "items-center"],
                    ["w-full", "px-4", "h-full"],
                )}>
                <Link href={"/"} asChild>
                    <Pressable className={twMerge("flex-row", "items-center", "gap-2")}>
                        <Ionicons name={"chatbubbles"} size={26} className={"text-primary-main"} />
                        <TextComponent
                            className={twMerge(["text-xl", "font-extrabold", "text-primary-main"])}>
                            토론대난투
                        </TextComponent>
                    </Pressable>
                </Link>

                <View className={twMerge("flex-row", "items-center", "gap-2")}>
                    <Pressable
                        className={twMerge(
                            ["p-2", "rounded-full"],
                            ["transition-all", "active:bg-background-default"],
                        )}>
                        <Ionicons
                            onPress={onChangeTheme}
                            name={theme === "light" ? "sunny" : "moon"}
                            size={22}
                            className={"text-text-default"}
                        />
                    </Pressable>

                    <Pressable
                        onPress={() => setIsMenuOpen(true)}
                        className={twMerge(["p-2", "rounded-lg", "bg-background-default"])}>
                        <Feather name={"menu"} size={24} className={"text-text-default"} />
                    </Pressable>
                </View>
            </View>

            <Modal
                visible={isMenuOpen}
                animationType={"slide"}
                transparent={false}
                onRequestClose={() => setIsMenuOpen(false)}>
                <SafeAreaView className={twMerge("flex-1", "bg-background-paper")}>
                    <View
                        className={twMerge(
                            ["flex-row", "justify-between", "items-center"],
                            ["w-full", "px-4", "h-16"],
                            ["border-b", "border-divider"],
                        )}>
                        <Pressable
                            className={twMerge("flex-row", "items-center", "gap-2")}
                            onPress={() => handleNavigate("/")}>
                            <Ionicons
                                name={"chatbubbles"}
                                size={26}
                                className={"text-primary-main"}
                            />
                            <TextComponent
                                className={twMerge([
                                    "text-xl",
                                    "font-extrabold",
                                    "text-primary-main",
                                ])}>
                                토론대난투
                            </TextComponent>
                        </Pressable>

                        <Pressable
                            onPress={() => setIsMenuOpen(false)}
                            className={twMerge(["p-2", "rounded-lg", "bg-background-default"])}>
                            <Feather name={"x"} size={24} className={"text-text-default"} />
                        </Pressable>
                    </View>

                    {/* 메뉴 부분 */}
                    <ScrollView
                        className={"flex-1"}
                        contentContainerStyle={{
                            flexGrow: 1,
                            paddingHorizontal: 20, // x축 방향 padding
                            paddingTop: 24,
                            paddingBottom: 40,
                        }}>
                        {/* 메인 메뉴 영역*/}
                        <TextComponent
                            className={twMerge("mb-3", [
                                "text-sm",
                                "text-text-secondary",
                                "font-extrabold",
                            ])}>
                            메인 메뉴
                        </TextComponent>
                        <View
                            className={twMerge(
                                ["mb-8", "bg-background-default", "rounded-xl"],
                                ["border", "border-divider"],
                            )}>
                            <Accordion
                                title={"토론장"}
                                className={twMerge("border-b", "border-divider")}>
                                {list.length === 0 && (
                                    <TextComponent
                                        className={twMerge(
                                            ["p-4", "text-center"],
                                            ["text-text-secondary", "text-sm"],
                                        )}>
                                        카테고리가 없습니다.
                                    </TextComponent>
                                )}
                                {list.map(item => (
                                    <Pressable
                                        key={item.id}
                                        className={twMerge(
                                            ["px-8", "py-3"],
                                            ["active:bg-background-default", "transition-all"],
                                        )}
                                        onPress={() => handleNavigate(`/categories/${item.id}`)}>
                                        <TextComponent className={twMerge("font-medium")}>
                                            {item.name}
                                        </TextComponent>
                                    </Pressable>
                                ))}
                            </Accordion>

                            <Pressable
                                onPress={() => handleNavigate("/notices")}
                                className={twMerge(
                                    ["px-8", "py-3"],
                                    ["active:bg-background-paper", "transition-all"],
                                )}>
                                <TextComponent className={"font-medium"}>공지사항</TextComponent>
                            </Pressable>
                        </View>

                        {/*  마이 메뉴 영역  */}
                        {isLoggedIn && (
                            <>
                                <TextComponent
                                    className={twMerge(
                                        ["font-extrabold", "test-sm", "text-text-secondary"],
                                        "mb-3",
                                    )}>
                                    마이페이지
                                </TextComponent>
                                <View
                                    className={twMerge(
                                        ["mb-10", "rounded-xl", "bg-background-default"],
                                        ["border", "border-divider"],
                                    )}>
                                    {MYPAGE_NAV_LIST.map((item, index) => {
                                        // 마지막 요소에만 border-b를 빼주기 위해서
                                        const isLast = index === MYPAGE_NAV_LIST.length - 1;

                                        return (
                                            <View key={index}>
                                                <Pressable
                                                    onPress={() => handleNavigate(item.path)}
                                                    className={twMerge(
                                                        [
                                                            "flex-row",
                                                            "justify-between",
                                                            "items-center",
                                                        ],
                                                        [
                                                            "p-4",
                                                            "active:bg-divider",
                                                            "transition-all",
                                                        ],
                                                        item.isDanger && "active:bg-error-main",
                                                        !isLast && ["border-b", "border-divider"],
                                                    )}>
                                                    <TextComponent
                                                        className={twMerge(
                                                            ["font-medium"],
                                                            item.isDanger && [
                                                                "text-error-main",
                                                                "active:text-error-contrast",
                                                            ],
                                                        )}>
                                                        {item.label}
                                                    </TextComponent>
                                                </Pressable>
                                            </View>
                                        );
                                    })}
                                </View>
                            </>
                        )}
                    </ScrollView>

                    <View className={twMerge("m-4", "pt-4", "border-t", "border-divider")}>
                        {isLoggedIn ? (
                            <View
                                className={twMerge(
                                    ["p-4", "rounded-xl"],
                                    ["border", "border-divider", "bg-background-default"],
                                )}>
                                <View
                                    className={twMerge(
                                        ["flex-row", "justify-between", "items-center"],
                                        "mb-4",
                                    )}>
                                    <View>
                                        <TextComponent
                                            className={twMerge("font-bold", "text-lg", "mb-1")}>
                                            {user?.nickname} 님
                                        </TextComponent>
                                        <TextComponent
                                            className={twMerge(["text-sm", "text-text-secondary"])}>
                                            {user?.email}
                                        </TextComponent>
                                    </View>
                                    {user?.role === Role.ADMIN && (
                                        <Pressable
                                            onPress={() => handleNavigate("/admin")}
                                            className={twMerge(
                                                ["p-2", "border", "border-divider"],
                                                ["rounded-full", "bg-background-paper"],
                                            )}>
                                            <Ionicons
                                                name={"shield"}
                                                size={20}
                                                className={"text-primary-main"}
                                            />
                                        </Pressable>
                                    )}
                                </View>
                                <Button
                                    fullWidth
                                    variant={"contained"}
                                    color={"error"}
                                    onPress={handleLogout}>
                                    로그아웃
                                </Button>
                            </View>
                        ) : (
                            <View className={twMerge("flex-row", "gap-3")}>
                                <Button
                                    className={"flex-1"}
                                    variant={"outlined"}
                                    color={"primary"}
                                    onPress={() => handleNavigate("/auth/login")}>
                                    로그인
                                </Button>
                                <Button
                                    className={"flex-1"}
                                    variant={"contained"}
                                    color={"primary"}
                                    onPress={() => handleNavigate("/auth/register")}>
                                    회원가입
                                </Button>
                            </View>
                        )}
                    </View>
                </SafeAreaView>
            </Modal>
        </View>
    );
}

export default MainHeaderMobile;
