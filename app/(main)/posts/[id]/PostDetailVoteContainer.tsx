import { PostDetailItemType } from "@/types/post";

interface Props {
    post: PostDetailItemType;
    onRefresh: () => Promise<void>;
}

function PostDetailVoteContainer({ post, onRefresh }: Props) {
    // 투표에 대한 Button도 출력되겠지만
    // 투표를 한단느 목적은 투표 반영 API가 있어야 하고
    // 투표 결과에 따른 결과 화면도 동시에 출력해줘야 함
    // 투표 결과를 보여주는 목적은 Props 중 post에 들어있음
    // 투표를 철회하고 재투표를 하게끔 cancel API가 있어야 함
}

export default PostDetailVoteContainer;
