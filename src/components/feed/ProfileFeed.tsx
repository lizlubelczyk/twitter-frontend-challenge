import React from "react";
import Feed from "./Feed";
import { useGetProfilePosts } from "../../hooks/useGetProfilePosts";
import { useEffect } from "react";

const ProfileFeed = () => {
    const { posts, isLoading, loadMore, error } = useGetProfilePosts();

    const handleScroll = () => {
        if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight) return;
        loadMore();
    };

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    if (error) return <div>Error loading posts</div>;

    return (
        <>
            <Feed posts={posts} loading={isLoading} />
        </>
    );
};
export default ProfileFeed;
