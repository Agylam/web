import { fetcher, HttpMethod } from "../utils/fetcher";

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
    const response = await fetcher<PushAnnouncementResponse>(
        ["/notification", localStorage.accessToken], { text, time }, HttpMethod.POST
    );
    return response.result;
};