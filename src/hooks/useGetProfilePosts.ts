import { useEffect, useState } from "react";
import { updateFeed, setLength } from "../redux/user";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { useGetPostsByUser } from "./index";
import { Post } from "../service";

export const useGetProfilePosts = () => {
  const [skip, setSkip] = useState(0);
  const limit = 10;
  const posts = useAppSelector((state) => state.user.feed);
  const dispatch = useAppDispatch();
  const id = useParams().id;

  const { data, isLoading, error } = useGetPostsByUser(id!, limit, skip);

  useEffect(() => {
    if (error) {
      console.error("Error fetching posts:", error);
    }
    if (Array.isArray(data)) {
      const updatedPosts = Array.from(new Set([...posts, ...data])).filter(
          (post) => post.authorId === id
      );
      dispatch(updateFeed(updatedPosts));
      dispatch(setLength(updatedPosts.length));
    }
  }, [data, error, dispatch]);

  const loadMore = () => {
    setSkip((prevSkip) => prevSkip + limit);
  };

  return { posts, isLoading, error, loadMore };
};
