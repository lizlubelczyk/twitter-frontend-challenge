import { useEffect } from "react";
import { setLength, updateFeed } from "../redux/user";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { useGetPosts } from "./index";

export const useGetFeed = () => {
  const query = useAppSelector((state) => state.user.query);
  const dispatch = useAppDispatch();
  const limit = 10;
  const skip = 0;

  const { data: posts, isLoading, error } = useGetPosts(query, limit, skip);

  useEffect(() => {
    if (error) {
      console.error("Error fetching posts:", error);
    }
    if (posts) {
      const updatedPosts = Array.from(new Set([...posts]));
      dispatch(updateFeed(updatedPosts));
      dispatch(setLength(updatedPosts.length));
    }
  }, [posts, error, dispatch]);

  return { posts, isLoading, error };
};
