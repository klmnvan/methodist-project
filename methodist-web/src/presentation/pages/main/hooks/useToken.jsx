import {useMutation} from "@tanstack/react-query";
import {postService} from "@/data/network/PostService.js";

export function useToken() {
    const { mutate, isPending, isError } = useMutation({
        mutationKey: 'refreshToken',
        mutationFn: () => postService.refreshToken()
    })
    return { mutate };
}