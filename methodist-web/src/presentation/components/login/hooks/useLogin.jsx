import {useMutation} from "@tanstack/react-query";
import {postService} from "@/data/network/PostService.js";

export const useLogin = () => {
    //isPending - запрос еще не содержит данных (источник: https://tanstack.com/query/latest/docs/framework/react/guides/queries)
    const { mutate, isPending, isError } = useMutation({
        mutationKey: 'login',
        mutationFn: (form) => postService.login(form)
    })
    return { mutate, isPending, isError };
}