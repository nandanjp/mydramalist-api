import honoClient from "@/hono-client";
import { useQuery } from "@tanstack/react-query";

const GET_TRACK_BY_ID = 'track'

export const useGetTrack = (trackId: string) => useQuery({
    queryKey: [GET_TRACK_BY_ID, trackId],
    queryFn: async () => honoClient.get.
})