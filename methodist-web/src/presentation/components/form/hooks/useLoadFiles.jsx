import {useMutation} from "@tanstack/react-query";
import {postService} from "@/data/network/PostService.js";

export const useLoadFiles = () => {

    const {mutate, isPending, isError} = useMutation({
        mutationKey: 'loadFiles',
        mutationFn: ({files, eventId}) => postService.uploadFiles(files, eventId)
    })
    return {mutate, isPending, isError};
}

