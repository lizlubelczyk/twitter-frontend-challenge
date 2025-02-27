import {useHttpRequestService} from "../service/HttpRequestService";
import {useApiMutation, useApiQuery} from "./useReactQuery";
import {util} from "prettier";
import {useQueryClient} from "@tanstack/react-query";
import {useEffect} from "react";

export function useMe():any{
    const {me} = useHttpRequestService()
    return useApiQuery(["me"], me)
}

export function useGetPosts(query: string, limit: number, skip: number) {
    console.log("useGetPosts called with:", { query, limit, skip });
    const { getPosts } = useHttpRequestService();
    return useApiQuery([query, limit.toString(), skip.toString()], () => getPosts(query, limit, skip));
}


export function useGetPostById(id: string) {
    const { getPostById } = useHttpRequestService();
    return useApiQuery(["post", id], () => getPostById(id));
}

export function useGetProfile(id: string) {
    const { getProfile } = useHttpRequestService();
    return useApiQuery(["profile", id], () => getProfile(id));
}

export function useInvalidateQueriesAtMidnight(queryKeys: string[]) {
    const queryClient = useQueryClient();

    const invalidateQueries = () => {
        queryKeys.forEach((key) => {
            queryClient.invalidateQueries({ queryKey: [key] });
        });
    };

    useEffect(() => {
        const now = new Date();
        const nextMidnight = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate() + 1,
            0,
            0,
            0
        );
        const timeUntilMidnight = nextMidnight.getTime() - now.getTime();

        const timeout = setTimeout(() => {
            invalidateQueries();
            setInterval(invalidateQueries, 24 * 60 * 60 * 1000);
        }, timeUntilMidnight);

        return () => clearTimeout(timeout); // Cleanup on unmount
    }, []);
}
