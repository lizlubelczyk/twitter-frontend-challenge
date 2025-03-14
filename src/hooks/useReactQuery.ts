import {MutationFunction, useMutation, UseMutationOptions, useQuery, useQueryClient} from "@tanstack/react-query";

export function useApiQuery<T>(queryKey: string[], queryFn: () => Promise<T>) {
    return useQuery<T>({
        queryKey,
        queryFn,
    });
}

export function useApiMutation<T>(
    mutationFn: MutationFunction<T>,
    invalidateQuery: boolean = true,
    invalidateQueryKeys: string[][] = [], // Array of query key arrays
    options?: UseMutationOptions<T>
) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn,
        onSuccess: () => {
            if (invalidateQuery) {
                invalidateQueryKeys.forEach((key) => {
                    queryClient.invalidateQueries({ queryKey: key });
                });
            }
        },
        ...options,
    });
}
