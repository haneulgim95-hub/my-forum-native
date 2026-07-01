import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Notice } from "@/types/notice";
import noticeApi from "@/api/user/noticeApi";
import { Alert, Platform, Pressable, ScrollView, View } from "react-native";
import { twMerge } from "tailwind-merge";
import Card from "@/components/common/card/Card";
import Title from "@/components/common/title/Title";
import TextComponent from "@/components/common/text/TextComponent";
import LoadingIndicator from "@/components/common/loading/LoadingIndicator";
import Pagination from "@/components/common/pagination/Pagination";

function NoticeListPage() {
    const router = useRouter();
    const [list, setList] = useState<Notice[]>([]);
    const [total, setTotal] = useState(0);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const { page, size } = useLocalSearchParams<{ page: string; size: string }>();
    const currentPage = Number(page) || 1;
    const pageSize = Number(size) || 15;

    const loadNotices = useCallback(async () => {
        try {
            setIsLoading(true);
            const result = await noticeApi.getNoticeList(currentPage, pageSize);
            setList(result.list);
            setTotal(result.total);
        } catch (error) {
            console.log(error);
            const msg = "공지사항 목록을 불러오는데 실패했습니다.";
            if (Platform.OS === "web") {
                alert(msg);
            } else {
                Alert.alert("오류", msg);
            }
        } finally {
            setIsLoading(false);
        }
    }, [currentPage, pageSize]);

    useEffect(() => {
        loadNotices().then(() => {});
    }, [loadNotices]);

    const totalPage = Math.ceil(total / pageSize) || 1;

    return (
        <ScrollView className={twMerge(["flex-1", "w-full", "bg-background-default"])}>
            <Title
                title={"공지사항"}
                description={"서비스의 주요 소식 및 안내 사항을 확인하세요"}
            />
            <Card className={twMerge("p-0")}>
                <View
                    className={twMerge(
                        ["flex-row", "items-center", "px-4", "py-3"],
                        ["border-b", "border-divider", "bg-background-default"],
                    )}>
                    <TextComponent
                        className={twMerge([
                            "hidden",
                            "md:flex",
                            "w-12",
                            "font-bold",
                            "text-text-secondary",
                        ])}>
                        번호
                    </TextComponent>
                    <TextComponent
                        className={twMerge(
                            ["flex-1", "px-2"],
                            ["font-bold", "text-text-secondary"],
                        )}>
                        제목
                    </TextComponent>
                    <TextComponent
                        className={twMerge(["w-24"], ["font-bold", "text-text-secondary"])}>
                        등록일
                    </TextComponent>
                </View>

                <View>
                    {isLoading ? (
                        <View className={"py-20"}>
                            <LoadingIndicator />
                        </View>
                    ) : (
                        <>
                            {list.length === 0 && (
                                <View
                                    className={twMerge("py-20", "justify-center", "items-center")}>
                                    <TextComponent className={twMerge(["text-text-secondary"])}>
                                        등록된 공지사항이 없습니다.
                                    </TextComponent>
                                </View>
                            )}
                            {list.map((item, index) => {
                                const isLast = index === list.length - 1;

                                return (
                                    <View
                                        key={index}
                                        className={twMerge(
                                            ["flex-row", "items-center"],
                                            ["px-4", "py-4", "transition-color"],
                                            ["hover:bg-background-default"],
                                            !isLast && ["border-b", "border-divider"],
                                        )}>
                                        <TextComponent
                                            className={twMerge(
                                                ["hidden", "md:flex", "w-12"],
                                                ["text-text-secondary"],
                                            )}>
                                            {item.id}
                                        </TextComponent>
                                        <Pressable
                                            className={twMerge(
                                                ["flex-1", "justify-center"],
                                                "px-2",
                                            )}
                                            onPress={() => router.push(`/notices/${item.id}`)}>
                                            <TextComponent
                                                className={twMerge([
                                                    "font-medium",
                                                    "transition-colors",
                                                    "hover:text-primary-main",
                                                ])}
                                                numberOfLines={1}
                                                ellipsizeMode={"tail"}>
                                                {item.title}
                                            </TextComponent>
                                        </Pressable>
                                        <TextComponent
                                            className={twMerge(
                                                ["w-24"],
                                                ["text-sm", "text-text-secondary", "text-center"],
                                            )}>
                                            {item.createdAt.substring(0, 10)}
                                        </TextComponent>
                                    </View>
                                );
                            })}
                        </>
                    )}
                </View>
            </Card>
            <View className={twMerge("py-4")}>
                <Pagination
                    color={"primary"}
                    shape={"square"}
                    currentPage={currentPage}
                    totalPage={totalPage}
                    onPageChange={newPage =>
                        router.setParams({
                            page: String(newPage),
                            size: String(pageSize),
                        })
                    }
                />
            </View>
        </ScrollView>
    );
}

export default NoticeListPage;
