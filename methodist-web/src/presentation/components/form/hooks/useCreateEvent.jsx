import {useMutation} from "@tanstack/react-query";
import {postService} from "@/data/network/PostService.js";

export const useCreateEvent = () => {
    const {mutate, isPending, isError} = useMutation({
        mutationKey: 'createEvent',
        mutationFn: (eventData) => postService.createEvent(eventData)
    })
    return {mutate, isPending, isError};
};