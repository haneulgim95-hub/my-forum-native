import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Notice } from "@/types/notice";
import noticeApi from "@/api/user/noticeApi";
import { Alert, Platform, ScrollView, View } from "react-native";
import LoadingIndicator from "@/components/common/loading/LoadingIndicator";
import { twMerge } from "tailwind-merge";
import Title from "@/components/common/title/Title";
import Button from "@/components/common/button/Button";
import TextComponent from "@/components/common/text/TextComponent";
import adminNoticeApi from "@/api/admin/adminNoticeApi";

function AdminNoticeDetailPage() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();
    const noticeId = Number(id);

    const [notice, setNotice] = useState<Notice | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const loadNotice = async () => {
            try {
                const result = await noticeApi.getNoticeById(noticeId);
                setNotice(result);
            } catch (error) {
                console.log(error);
                if (Platform.OS === "web") {
                    alert("공지사항 정보를 불러오는데 실패했습니다.");
                    router.push("/admin/notices");
                } else {
                    Alert.alert("오류", "공지사항 정보를 불러오는데 실패했습니다.", [
                        { text: "확인", onPress: () => router.push("/admin/notices") },
                    ]);
                }
            } finally {
                setIsLoading(false);
            }
        };
        loadNotice().then(() => {});
    }, [noticeId, router]);

    const handleDeleteNotice = async () => {
        // 실제 동작해야 되는 기능을 함수로 작성하고
        // 사용자에게 confirm을 띄워서 확인 작업을 마치면 함수가 실행되도록 리팩토링
        const executeDelete = async () => {
            try {
                await adminNoticeApi.deleteNotice(noticeId);
                if (Platform.OS === "web") {
                    alert("공지사항을 성공적으로 삭제했습니다.");
                    router.push("/admin/notices");
                } else {
                    Alert.alert("삭제 완료", "공지사항을 성공적으로 삭제했습니다.", [
                        { text: "확인", onPress: () => router.push("/admin/notices") },
                    ]);
                }
            } catch (error) {
                console.log(error);
                if (Platform.OS === "web") {
                    alert("공지사항을 삭제하는 중 오류가 발생했습니다.");
                } else {
                    Alert.alert("오류", "공지사항을 삭제하는 중 오류가 발생했습니다.");
                }
            }
        };

        if (Platform.OS === "web") {
            if (confirm("정말로 해당 공지사항을 삭제하시겠습니까?")) {
                await executeDelete();
            }
        } else {
            Alert.alert("공지사항 삭제", "정말로 해당 공지사항을 삭제하시겠습니까?", [
                { text: "확인", style: "destructive", onPress: executeDelete },
                { text: "취소", style: "cancel" },
            ]);
        }
    };

    if (isLoading || !notice) {
        return <LoadingIndicator fullScreen />;
    }

    return (
        <View className={twMerge("flex-1", "w-full")}>
            <Title
                title={"공지사항 상세"}
                description={"등록된 공지사항의 내용을 확인합니다."}></Title>

            <ScrollView
                className={twMerge(
                    ["flex-1", "p-6"],
                    ["bg-background-paper", "rounded-xl", "border", "border-divider"],
                )}>
                <View className={twMerge(["border-b", "border-divider"], ["pb-4", "mb-6"])}>
                    <TextComponent className={twMerge("mb-2", ["text-xl", "font-bold"])}>
                        {notice.title}
                    </TextComponent>
                    <View className={twMerge("flex-row", "justify-between", "items-center")}>
                        <TextComponent className={twMerge("text-sm", "text-text-secondary")}>
                            관리자
                        </TextComponent>
                        <TextComponent className={twMerge("text-sm", "text-text-secondary")}>
                            등록일 : {notice.createdAt.substring(0, 10)}
                        </TextComponent>
                    </View>
                </View>

                <View className={"min-h-80"}>
                    <TextComponent className={twMerge("leading-relaxed")}>
                        {notice.content}
                    </TextComponent>
                </View>

                <View
                    className={twMerge(
                        ["flex-row", "justify-between", "items-center"],
                        ["mt-10", "pt-6"],
                        ["border-divider", "border-t"],
                    )}>
                    <Button
                        variant={"outlined"}
                        color={"secondary"}
                        onPress={() => router.push("/admin/notices")}>
                        목록으로
                    </Button>

                    <View className={twMerge("flex-row", "gap-3")}>
                        <Button variant={"outlined"} color={"error"} onPress={handleDeleteNotice}>
                            삭제
                        </Button>
                        <Button
                            variant={"contained"}
                            color={"warning"}
                            onPress={() => router.push(`/admin/notices/${notice.id}/update`)}>
                            수정
                        </Button>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

export default AdminNoticeDetailPage;
