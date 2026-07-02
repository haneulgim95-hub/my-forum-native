import { useLocalSearchParams, useRouter } from "expo-router";
import { useAuthStore } from "@/stores/auth/useAuthStore";
import { useCallback, useEffect, useState } from "react";
import { PostDetailItemType } from "@/types/post";
import { Alert, Platform, ScrollView, View } from "react-native";
import postApi from "@/api/user/postApi";
import LoadingIndicator from "@/components/common/loading/LoadingIndicator";
import { twMerge } from "tailwind-merge";
import Title from "@/components/common/title/Title";
import Card from "@/components/common/card/Card";
import TextComponent from "@/components/common/text/TextComponent";
import Button from "@/components/common/button/Button";
import PostDetailVoteContainer from "@/app/(main)/posts/[id]/PostDetailVoteContainer";

function PostDetailPage() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();
    const postId = Number(id);
    const { user } = useAuthStore();

    const [post, setPost] = useState<PostDetailItemType | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const loadPost = useCallback(async () => {
        try {
            const result = await postApi.getPostById(postId);
            setPost(result);
        } catch (error) {
            console.log(error);
            const msg = "게시글을 조회하는 중 오류가 발생했습니다.";
            if (Platform.OS === "web") {
                alert(msg);
            } else {
                // 🛠️ 괄호 오타 수정 완료
                Alert.alert("오류", msg, [{ text: "확인", onPress: () => router.back() }]);
            }
        } finally {
            setIsLoading(false);
        }
    }, [postId, router]); // 의존성 배열에 필요한 값 추가

    useEffect(() => {
        // 상세이기는 하지만, 사용자가 vote를 하면 다시 API요청을 해서
        // 값을 갱신해줘야되니깐, 밖에다가 loadPost 함수를 작성해야 함
        loadPost().then(() => {});
    }, [loadPost]);

    const isAuthor = post?.user.id === user?.id;

    if (isLoading || !post) {
        return <LoadingIndicator />;
    }

    return (
        <ScrollView className={twMerge(["flex-1", "w-full"])}>
            <Title
                title={"토론 게시판"}
                description={"다양한 의견을 나누고 투표에 참여하세요."}></Title>
            <Card>
                <View className={twMerge(["border-b", "border-divider"], ["pb-4", "mb-6"])}>
                    <TextComponent
                        className={twMerge(["text-xl", "md:text-2xl", "font-bold"], "mb-4")}>
                        {post.title}
                    </TextComponent>

                    <View
                        className={twMerge(
                            ["flex-row", "justify-between", "items-center"],
                            ["flex-wrap", "gap-2"],
                        )}>
                        <TextComponent className={twMerge(["text-sm", "font-bold"])}>
                            {post.user.nickname}
                        </TextComponent>
                        <View className={twMerge(["flex-row", "items-center", "gap-3"])}>
                            <TextComponent className={twMerge(["text-sm", "text-text-secondary"])}>
                                조회 {post.views}
                            </TextComponent>
                            <TextComponent className={twMerge(["text-sm", "text-divider"])}>
                                |
                            </TextComponent>
                            <TextComponent className={twMerge(["text-sm", "text-text-secondary"])}>
                                {post.createdAt.substring(0, 10)}
                            </TextComponent>
                        </View>
                    </View>
                </View>

                <View className={"min-h-52"}>
                    <TextComponent className={twMerge("leading-relaxed")}>
                        {post.content}
                    </TextComponent>
                </View>

                {/*    투표 영역 */}
                {post.option1Text && post.option2Text && (
                    <PostDetailVoteContainer post={post} onRefresh={loadPost} />
                )}

                <View
                    className={twMerge(
                        ["flex-row", "justify-end", "items-center", "gap-3"],
                        "mt-10",
                    )}>
                    <Button variant={"contained"} color={"secondary"} onPress={() => router.back()}>
                        목록으로
                    </Button>
                </View>
            </Card>
        </ScrollView>
    );
}

export default PostDetailPage;
