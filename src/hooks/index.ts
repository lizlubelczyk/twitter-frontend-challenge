import {useHttpRequestService} from "../service/HttpRequestService";
import {useApiQuery} from "./useReactQuery";
import {util} from "prettier";

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
