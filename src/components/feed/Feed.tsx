import React from "react";
import { Post } from "../../service";
import { StyledContainer } from "../common/Container";
import Tweet from "../tweet/Tweet";
import Loader from "../loader/Loader";

interface FeedProps {
    posts?: Post[];
    loading: boolean;
}

const Feed = ({ posts = [], loading }: FeedProps) => {
    return (
        <StyledContainer
            width="100%"
            alignItems="center"
            display="flex"
            flexDirection="column"
            height="100%"
        >
            {posts.length > 0 ? (
                posts.map((post) => <Tweet key={post.id} post={post} />)
            ) : (
                <div>No posts available</div>
            )}
            {loading && <Loader />}
        </StyledContainer>
    );
};

export default Feed;
