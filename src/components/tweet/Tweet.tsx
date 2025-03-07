import React, {useEffect, useState} from "react";
import {StyledTweetContainer} from "./TweetContainer";
import AuthorData from "./user-post-data/AuthorData";
import type {Post, User} from "../../service";
import {StyledReactionsContainer} from "./ReactionsContainer";
import Reaction from "./reaction/Reaction";
import {useHttpRequestService} from "../../service/HttpRequestService";
import {IconType} from "../icon/Icon";
import {StyledContainer} from "../common/Container";
import ThreeDots from "../common/ThreeDots";
import DeletePostModal from "./delete-post-modal/DeletePostModal";
import ImageContainer from "./tweet-image/ImageContainer";
import CommentModal from "../comment/comment-modal/CommentModal";
import {useNavigate} from "react-router-dom";
import {useMe} from "../../hooks";

interface TweetProps {
  post: Post;
}

const Tweet = ({post}: TweetProps) => {
  const [actualPost, setActualPost] = useState<Post>(post);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [showCommentModal, setShowCommentModal] = useState<boolean>(false);
  const service = useHttpRequestService();
  const navigate = useNavigate();
  const { data: user, error, isLoading } = useMe();

  const handleReaction = async (type: string) => {
        let reacted;
        if (type === "LIKE") {
            reacted = actualPost.likes.find((r) => r.userId === user?.id);
            if (reacted) {
                await service.deleteReaction(actualPost.id, "like");
            } else {
                await service.createReaction(actualPost.id, "like");
            }
        } else if (type === "RETWEET") {
            reacted = actualPost.retweets.find((r) => r.userId === user?.id);
            if (reacted) {
                await service.deleteReaction(actualPost.id, "retweet");
            } else {
                await service.createReaction(actualPost.id, "retweet");
            }
        }
        const newPost = await service.getPostById(post.id);
        setActualPost(newPost);
    };

    const hasReactedByType = (type: string): boolean => {
        if (type === "LIKE") {
            return actualPost.likes.some((r) => r.userId === user?.id);
        } else if (type === "RETWEET") {
            return actualPost.retweets.some((r) => r.userId === user?.id);
        }
        return false;
    };

  return (
      <StyledTweetContainer>
        <StyledContainer
            style={{width: "100%"}}
            flexDirection={"row"}
            alignItems={"center"}
            justifyContent={"center"}
            maxHeight={"48px"}
        >
          <AuthorData
              id={post.author.id}
              name={post.author.name ?? "Name"}
              username={post.author.username}
              createdAt={post.createdAt}
              profilePicture={post.author.profilePicture}
          />
          {post.author.id === user?.id && (
              <>
                <DeletePostModal
                    show={showDeleteModal}
                    id={post.id}
                    onClose={() => {
                      setShowDeleteModal(false);
                    }}
                />
                <ThreeDots
                    onClick={() => {
                      setShowDeleteModal(!showDeleteModal);
                    }}
                />
              </>
          )}
        </StyledContainer>
        <StyledContainer onClick={() => navigate(`/post/${post.id}`)}>
          <p>{post.content}</p>
        </StyledContainer>
        {post.images && post.images!.length > 0 && (
            <StyledContainer padding={"0 0 0 10%"}>
              <ImageContainer images={post.images}/>
            </StyledContainer>
        )}
        <StyledReactionsContainer>
          <Reaction
              img={IconType.CHAT}
              count={actualPost?.comments?.length}
              reactionFunction={() =>
                  window.innerWidth > 600
                      ? setShowCommentModal(true)
                      : navigate(`/compose/comment/${post.id}`)
              }
              increment={0}
              reacted={false}
          />
          <Reaction
              img={IconType.RETWEET}
              count={actualPost.retweets.length}
              reactionFunction={() => handleReaction("RETWEET")}
              increment={1}
              reacted={hasReactedByType("RETWEET")}
          />
          <Reaction
              img={IconType.LIKE}
              count={actualPost.likes.length}
              reactionFunction={() => handleReaction("LIKE")}
              increment={1}
              reacted={hasReactedByType("LIKE")}
          />
        </StyledReactionsContainer>
        <CommentModal
            show={showCommentModal}
            post={post}
            onClose={() => setShowCommentModal(false)}
        />
      </StyledTweetContainer>
  );
};

export default Tweet;
