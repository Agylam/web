import { HttpMethod } from "../utils/fetcher";
import { apiFetcher } from "./apiFetcher";

interface AnnouncementTime {
    hours: number;
    minutes: number;
}

interface PushAnnouncementResponse {
    error?: string;
    message?: string;
    result?: {
        uuid: string;
        text: string;
        time: {
            hours: number;
            minutes: number;
        };
    };
}

export const pushAnnouncement = async (text: string, time?: AnnouncementTime) => {
    const response = await apiFetcher()<PushAnnouncementResponse>("/announcement/new", { text, time }, HttpMethod.POST);
    return response.result;
};
