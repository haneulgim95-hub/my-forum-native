import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Notice } from "@/types/notice";
import noticeApi from "@/api/user/noticeApi";
import { Alert, Platform, ScrollView, View } from "react-native";
import LoadingIndicator from "@/components/common/loading/LoadingIndicator";
import { twMerge } from "tailwind-merge";
import Title from "@/components/common/title/Title";
import Card from "@/components/common/card/Card";
import TextComponent from "@/components/common/text/TextComponent";
import Button from "@/components/common/button/Button";

function NoticeDetailPage() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();
    const noticeId = Number(id);

    const [notice, setNotice] = useState<Notice | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        if (!noticeId) return;
        const loadNotice = async () => {
            try {
                const result = await noticeApi.getNoticeById(noticeId);
                setNotice(result);
            } catch (error) {
                console.log(error);
                const msg = "공지사항 정보를 불러오는데 실패했습니다.";
                if (Platform.OS === "web") {
                    alert(msg);
                } else {
                    Alert.alert("오류", msg, [{ text: "확인", onPress: () => router.back() }]);
                }
            } finally {
                setIsLoading(false);
            }
        };
        loadNotice().then(() => {});
    }, [noticeId, router]);

    if (isLoading || !notice) {
        return <LoadingIndicator />;
    }

    return (
        <ScrollView className={twMerge(["flex-1", "w-full"])}>
            <Title
                title={"공지사항"}
                description={"서비스의 주요 소식 및 안내 사항입니다."}></Title>
            <Card>
                <View className={twMerge(["border-b", "border-divider"], ["pb-4", "mb-6"])}>
                    <TextComponent
                        className={twMerge(["text-xl", "md:text-2xl", "font-bold"], "mb-3")}>
                        {notice.title}
                    </TextComponent>
                    <View className={twMerge(["flex-row", "items-center", "justify-between"])}>
                        <TextComponent
                            className={twMerge(["text-sm", "font-medium", "text-text-secondary"])}>
                            관리자
                        </TextComponent>
                        <TextComponent className={twMerge(["text-sm", "text-text-secondary"])}>
                            등록일: {notice.createdAt.substring(0, 10)}
                        </TextComponent>
                    </View>
                </View>

                <View className={"min-h-80"}>
                    <TextComponent className={twMerge(["leading-relaxed"])}>
                        {notice.content}
                    </TextComponent>
                </View>

                <View
                    className={twMerge(
                        ["flex-row", "justify-end", "items-center"],
                        ["mt-10", "pt-6"],
                        ["border-t", "border-divider"],
                    )}>
                    <Button
                        variant={"outlined"}
                        color={"secondary"}
                        onPress={() => router.push("/notices")}>
                        목록으로
                    </Button>
                </View>
            </Card>
        </ScrollView>
    );
}

export default NoticeDetailPage;
