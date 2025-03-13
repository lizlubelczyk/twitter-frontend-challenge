import { useEffect, useState } from "react";
import { setLength, updateFeed } from "../redux/user";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { useGetPosts } from "./index";
import {Post} from "../service";

export const useGetFeed = () => {
  const query = useAppSelector((state) => state.user.query);
  const dispatch = useAppDispatch();
  const limit = 10;
  const [skip, setSkip] = useState(0);
  const [allPosts, setAllPosts] = useState<Post[]>([]);

  const { data: posts, isLoading, error } = useGetPosts(query, limit, skip);

  useEffect(() => {
    if (error) {
      console.error("Error fetching posts:", error);
    }
    if (posts) {
      const updatedPosts = Array.from(new Set([...allPosts, ...posts]));
      setAllPosts(updatedPosts);
      dispatch(updateFeed(updatedPosts));
      dispatch(setLength(updatedPosts.length));
    }
  }, [posts, error, dispatch]);

  const loadMore = () => {
    setSkip((prevSkip) => prevSkip + limit);
  };

  return { posts: allPosts, isLoading, error, loadMore };
};
