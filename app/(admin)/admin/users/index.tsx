import { useEffect, useState } from "react";
import { User } from "@/types/user";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Alert, Platform, Pressable, ScrollView, View } from "react-native";
import adminUserApi from "@/api/admin/adminUserApi";
import { twMerge } from "tailwind-merge";
import Title from "@/components/common/title/Title";
import Button from "@/components/common/button/Button";
import Card from "@/components/common/card/Card";
import TextComponent from "@/components/common/text/TextComponent";
import Badge from "@/components/common/badge/Badge";
import { Feather } from "@expo/vector-icons";
import Pagination from "@/components/common/pagination/Pagination";

function AdminUserListPage() {
    const [list, setList] = useState<User[]>([]);
    const [total, setTotal] = useState(0);
    const router = useRouter();
    const { page, size } = useLocalSearchParams<{ page: string; size: string }>();
    const currentPage = Number(page) || 1;
    const pageSize = Number(size) || 20;
    const totalPage = Math.ceil(total / pageSize) || 1;

    const loadUsers = async (targetPage: number, targetSize: number) => {
        try {
            const result = await adminUserApi.getUserList(targetPage, targetSize);
            setList(result.list);
            setTotal(result.total);
        } catch (error) {
            console.log(error);
            if (Platform.OS === "web") {
                alert("사용자 목록을 조회하는 중 오류가 발생했습니다.");
            } else {
                Alert.alert("오류", "사용자 목록을 조회하는 중 오류가 발생했습니다.");
            }
        }
    };

    useEffect(() => {
        loadUsers(currentPage, pageSize).then(() => {});
    }, [currentPage, pageSize]);

    const handleDeleteUser = async (id: number) => {
        const executeDelete = async () => {
            try {
                await adminUserApi.deleteUser(id);
                await loadUsers(currentPage, pageSize);
            } catch (error) {
                console.log(error);
                if (Platform.OS === "web") {
                    alert("유저 삭제에 실패했습니다.");
                } else {
                    Alert.alert("오류", "유저 삭제에 실패했습니다.");
                }
            }
        };

        if (Platform.OS === "web") {
            if (confirm("정말 이 유저를 삭제 처리 하시겠습니까?")) {
                await executeDelete();
            }
        } else {
            Alert.alert("경고", "정말 이 유저를 삭제 처리 하시겠습니까?", [
                { text: "취소", style: "cancel" },
                { text: "삭제", style: "destructive", onPress: executeDelete },
            ]);
        }
    };

    return (
        <View className={twMerge("flex-1", "w-full")}>
            <Title
                title={"회원 관리"}
                description={"서비스에 가입한 유저 목록을 조회하고 관리합니다."}>
                <Button
                    variant={"contained"}
                    color={"primary"}
                    onPress={() => router.push("/admin/users/create")}>
                    + 유저 생성
                </Button>
            </Title>

            <Card className={twMerge("p-0")}>
                <View
                    className={twMerge(
                        ["flex-row", "items-center", "px-4", "py-3"],
                        ["border-b", "border-divider", "rounded-t-xl", "bg-background-default"],
                    )}>
                    <TextComponent
                        className={twMerge(
                            ["hidden", "md:flex", "w-12"],
                            ["font-bold", "text-text-secondary", "text-center"],
                        )}>
                        ID
                    </TextComponent>
                    <TextComponent
                        className={twMerge(
                            ["flex-1"],
                            ["font-bold", "text-text-secondary", "px-2"],
                        )}>
                        유저 정보
                    </TextComponent>
                    <TextComponent
                        className={twMerge(
                            ["w-16"],
                            ["font-bold", "text-text-secondary", "text-center"],
                        )}>
                        권한
                    </TextComponent>
                    <TextComponent
                        className={twMerge(
                            ["w-24", "hidden", "md:flex"],
                            ["font-bold", "text-text-secondary", "text-center"],
                        )}>
                        가입일
                    </TextComponent>
                    <TextComponent
                        className={twMerge(
                            ["w-20"],
                            ["font-bold", "text-text-secondary", "text-center"],
                        )}>
                        관리
                    </TextComponent>
                </View>
                <ScrollView className={"flex-1"}>
                    {list.length === 0 && (
                        <View className={twMerge("py-10", "justify-center", "items-center")}>
                            <TextComponent>등록된 유저가 없습니다.</TextComponent>
                        </View>
                    )}
                    {list.map((item, index) => (
                        <View
                            key={item.id}
                            className={twMerge(
                                ["flex-row", "items-center", "px-4", "py-3", "transition-all"],
                                ["border-b", "border-divider"],
                                index === list.length - 1 && ["rounded-b-xl", "border-b-0"],
                            )}>
                            <TextComponent
                                className={twMerge(["hidden", "md:flex", "w-12"], ["text-center"])}>
                                {item.id}
                            </TextComponent>
                            <View className={twMerge(["flex-1"], ["px-2"])}>
                                <View className={twMerge("flex-row", "items-center", "gap-1.5")}>
                                    <TextComponent className={"font-bold"} numberOfLines={1}>
                                        {item.username}
                                    </TextComponent>
                                    {item.deletedAt && (
                                        <Badge color={"error"} size={"small"} variant={"outlined"}>
                                            탈퇴
                                        </Badge>
                                    )}
                                </View>
                                <TextComponent
                                    className={twMerge("text-xs", "text-text-secondary", "mt-0.5")}
                                    numberOfLines={1}>
                                    {item.name} ({item.nickname})
                                </TextComponent>
                            </View>
                            <View className={twMerge(["w-16"], ["text-center"])}>
                                <Badge
                                    color={item.role === "ADMIN" ? "info" : "secondary"}
                                    size={"small"}>
                                    {item.role}
                                </Badge>
                            </View>
                            <TextComponent
                                className={twMerge(["w-24", "hidden", "md:flex"], ["text-center"])}>
                                {item.createdAt.substring(0, 10)}
                            </TextComponent>
                            <View className={twMerge(["w-20"], ["text-center", "flex-row"])}>
                                <Pressable
                                    className={"p-1.5"}
                                    disabled={!!item.deletedAt}
                                    onPress={() => router.push(`/admin/users/${item.id}`)}>
                                    <Feather
                                        name={"edit-2"}
                                        size={16}
                                        className={
                                            item.deletedAt
                                                ? "text-text-secondary"
                                                : "text-text-secondary hover:text-primary-main"
                                        }
                                    />
                                </Pressable>
                                <Pressable
                                    className={"p-1.5"}
                                    disabled={!!item.deletedAt}
                                    onPress={() => handleDeleteUser(item.id)}>
                                    <Feather
                                        name={"trash-2"}
                                        size={16}
                                        className={
                                            item.deletedAt
                                                ? "text-text-secondary"
                                                : "text-error-main"
                                        }
                                    />
                                </Pressable>
                            </View>
                        </View>
                    ))}
                </ScrollView>
            </Card>
            <Pagination
                currentPage={currentPage}
                totalPage={totalPage}
                onPageChange={newPage =>
                    router.setParams({ page: String(newPage), size: String(pageSize) })
                }
                size={"medium"}
                color={"primary"}
                shape={"square"}
            />
        </View>
    );
}

export default AdminUserListPage;
