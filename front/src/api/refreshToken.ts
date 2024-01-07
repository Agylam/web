import { fetcher, HttpMethod } from "../utils/fetcher";

export const refreshToken = () => {
    return fetcher<{ accessToken: string }>(["/auth/refresh/"], {}, HttpMethod.POST);
};