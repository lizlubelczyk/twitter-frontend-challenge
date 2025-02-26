import React, { useState, useEffect } from "react";
import { StyledContainer } from "../../components/common/Container";
import Tweet from "../../components/tweet/Tweet";
import Loader from "../../components/loader/Loader";
import { HttpService } from "../../service/HttpRequestService";
import TweetBox from "../../components/tweet-box/TweetBox";
import { StyledH5 } from "../../components/common/text";
import { StyledFeedContainer } from "../home-page/components/contentContainer/FeedContainer";
import CommentFeed from "../../components/feed/CommentFeed";
import {Reaction} from "../../service";
import {useGetPostById} from "../../hooks";

interface Post {
    id: string;
    content: string;
    author: {
        id: string;
        name: string;
        username: string;
        avatarUrl?: string;
        private: boolean;
        createdAt: Date;
    };
    createdAt: Date;
    updatedAt?: Date;
    likes: Reaction[];
    comments: Post[];
    retweets: Reaction[];
    authorId: string;
}

const PostPage: React.FC = () => {
  const [postId, setPostId] = useState<string>(window.location.href.split("/")[4]);
  const {data: post} = useGetPostById(postId);

  return (
      <StyledContainer borderRight={"1px solid #ebeef0"}>
        <StyledContainer padding={"16px"} borderBottom={"1px solid #ebeef0"} maxHeight={"53px"}>
          <StyledH5>Tweet</StyledH5>
        </StyledContainer>
        <StyledFeedContainer>
          {post ? (
              <>
                <Tweet post={post} />
                <StyledContainer borderBottom={"1px solid #ebeef0"} padding={"16px"}>
                  <TweetBox parentId={postId} />
                </StyledContainer>
                <StyledContainer minHeight={"53.5vh"}>
                  <CommentFeed postId={postId} />
                </StyledContainer>
              </>
          ) : (
              <StyledContainer justifyContent={"center"} alignItems={"center"}>
                <Loader />
              </StyledContainer>
          )}
        </StyledFeedContainer>
      </StyledContainer>
  );
};

export default PostPage;
