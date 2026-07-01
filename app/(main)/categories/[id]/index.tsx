import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { PostListItemType } from "@/types/post";
import { Alert, Platform, Pressable, ScrollView, View } from "react-native";
import postApi from "@/api/user/postApi";
import { twMerge } from "tailwind-merge";
import TextComponent from "@/components/common/text/TextComponent";
import Button from "@/components/common/button/Button";
import Title from "@/components/common/title/Title";
import Card from "@/components/common/card/Card";
import LoadingIndicator from "@/components/common/loading/LoadingIndicator";
import Badge from "@/components/common/badge/Badge";
import Pagination from "@/components/common/pagination/Pagination";

function PostListPage() {
    const router = useRouter();
    const { id, page, size } = useLocalSearchParams<{ id: string; page: string; size: string }>();
    const categoryId = Number(id);
    const currentPage = Number(page) | 1;
    const pageSize = Number(size) | 20;

    const [list, setList] = useState<PostListItemType[]>([]);
    const [total, setTotal] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    const loadPosts = useCallback(async () => {
        try {
            const result = await postApi.getPostsByCategory(categoryId, currentPage, pageSize);
            setList(result.list);
            setTotal(result.total);
        } catch (error) {
            console.log(error);
            const msg = "게시글 목록을 불러오는데 실패했습니다.";
            if (Platform.OS === "web") {
                alert(msg);
            } else {
                Alert.alert("오류", msg);
            }
        } finally {
            setIsLoading(false);
        }
    }, [categoryId, currentPage, pageSize]);

    useEffect(() => {
        if (!categoryId) return;
        loadPosts().then(() => {});
    }, [loadPosts, categoryId]);

    const totalPage = Math.ceil(total / pageSize) || 1;

    if (!categoryId) {
        return (
            <View className={twMerge("flex-1", "justify-center", "items-center")}>
                <TextComponent className={twMerge(["text-error-main", "mb-4"])}>
                    올바르지 않은 카테고리 접근입니다.
                </TextComponent>
                <Button variant={"contained"} color={"primary"} onPress={() => router.back()}>
                    뒤로 가기
                </Button>
            </View>
        );
    }

    return (
        <ScrollView className={twMerge(["flex-1", "w-full"])}>
            <Title
                title={"토론 게시판"}
                description={"다양한 주제에 대해 의견을 나누고 투표에 참여해보세요"}>
                <Button
                    variant={"contained"}
                    color={"primary"}
                    onPress={() => router.push(`/posts/create?categoryId=${categoryId}`)}>
                    글쓰기
                </Button>
            </Title>

            <Card className={twMerge(["p-0", "overflow-hidden"])}>
                {/*    제목줄*/}
                <View
                    className={twMerge(
                        ["hidden", "md:flex"],
                        ["flex-row", "items-center", "px-4", "py-3"],
                        ["border-b", "border-divider", "bg-background-default"],
                    )}>
                    <TextComponent
                        className={twMerge(
                            ["w-16"],
                            ["text-text-secondary", "font-bold", "text-center"],
                        )}>
                        번호
                    </TextComponent>
                    <TextComponent
                        className={twMerge(
                            ["flex-1", "px-2"],
                            ["text-text-secondary", "font-bold"],
                        )}>
                        제목
                    </TextComponent>
                    <TextComponent
                        className={twMerge(
                            ["w-28"],
                            ["text-text-secondary", "font-bold", "text-center"],
                        )}>
                        작성자
                    </TextComponent>
                    <TextComponent
                        className={twMerge(
                            ["w-20"],
                            ["text-text-secondary", "font-bold", "text-center"],
                        )}>
                        조회수
                    </TextComponent>
                    <TextComponent
                        className={twMerge(
                            ["w-24"],
                            ["text-text-secondary", "font-bold", "text-center"],
                        )}>
                        작성일
                    </TextComponent>
                </View>
                {/*    내용*/}

                <View>
                    {isLoading && (
                        <View className={"py-20"}>
                            <LoadingIndicator />
                        </View>
                    )}
                    {!isLoading && list.length === 0 && (
                        <View className={twMerge(["py-20", "justify-center", "items-center"])}>
                            <TextComponent className={"text-text-secondary"}>
                                등록된 토론 게시글이 없습니다.
                            </TextComponent>
                        </View>
                    )}
                    {list.map((item, index) => {
                        const isLast = index === list.length - 1;

                        return (
                            <View
                                key={item.id}
                                className={twMerge(
                                    ["flex-col", "md:flex-row", "md:items-center"],
                                    ["px-4", "py-3", "md:px-4"],
                                    ["transition-colors", "hover:bg-background-default"],
                                    !isLast && ["border-b", "border-divider"],
                                )}>
                                <TextComponent
                                    className={twMerge(
                                        ["hidden", "md:flex", "justify-center", "w-16"],
                                        ["text-center", "text-text-secondary"],
                                    )}>
                                    {item.id}
                                </TextComponent>
                                <Pressable
                                    className={twMerge(
                                        ["flex-1", "flex-row", "items-center", "gap-2"],
                                        ["md:px-2", "mb-1.5", "md:mb-0"],
                                    )}
                                    onPress={() => router.push(`/posts/${item.id}`)}>
                                    <TextComponent
                                        className={twMerge([
                                            "font-medium",
                                            "hover:text-primary-main",
                                            "transition-colors",
                                        ])}
                                        numberOfLines={1}>
                                        {item.title}
                                    </TextComponent>
                                    {item.option1Text && item.option2Text && (
                                        <Badge
                                            size={"small"}
                                            color={"primary"}
                                            textClasses={"text-[8px]"}>
                                            VOTE
                                        </Badge>
                                    )}
                                </Pressable>

                                {/*
                                    작성자, 조회수, 작성일을 하나의 View로 묶어서
                                    PC에서는 표 전체를 감싸고 있는 vIEW의 FLEX-ROW를 통해 전체가 한 줄로 나오게 하고
                                    모바일에서는 vIEW의 FLEX-COL을 통해 두번째 줄로 묶어서 나오게 함
                                */}
                                <View
                                    className={twMerge([
                                        "flex-row",
                                        "items-center",
                                        "gap-2",
                                        "md:gap-0",
                                    ])}>
                                    <TextComponent
                                        className={twMerge(
                                            ["text-xs", "md:text-sm"],
                                            ["text-text-secondary", "md:text-text-default"],
                                            ["md:w-28", "md:text-center"],
                                        )}>
                                        {item.user?.nickname}
                                    </TextComponent>
                                    <TextComponent
                                        className={twMerge("md:hidden", "text-xs", "text-divider")}>
                                        |
                                    </TextComponent>
                                    <TextComponent
                                        className={twMerge(
                                            ["text-xs", "md:text-sm"],
                                            ["text-text-secondary", "md:text-text-default"],
                                            ["md:w-20", "md:text-center"],
                                        )}>
                                        <TextComponent
                                            className={twMerge(
                                                "md:hidden",
                                                "text-xs",
                                                "text-text-secondary",
                                            )}>
                                            조회 :{" "}
                                        </TextComponent>
                                        {item.views}
                                    </TextComponent>
                                    <TextComponent
                                        className={twMerge("md:hidden", "text-xs", "text-divider")}>
                                        |
                                    </TextComponent>

                                    <TextComponent
                                        className={twMerge(
                                            ["text-xs", "md:-text-sm"],
                                            ["text-text-secondary", "md:text-text-default"],
                                            ["md:w-24", "md:text-center"],
                                        )}>
                                        {item.createdAt.substring(0, 10)}
                                    </TextComponent>
                                </View>
                            </View>
                        );
                    })}
                </View>
            </Card>
            <View className={"py-4"}>
                <Pagination
                    currentPage={currentPage}
                    totalPage={totalPage}
                    onPageChange={newPage => {
                        router.setParams({ page: String(newPage), size: String(pageSize) });
                    }}
                    color={"primary"}
                    shape={"square"}
                />
            </View>
        </ScrollView>
    );
}

export default PostListPage;
