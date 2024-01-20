import { HttpMethod } from "../utils/fetcher";
import { apiFetcher } from "./apiFetcher";

export const refreshToken = () => {
    return apiFetcher()<{ accessToken: string }>("/auth/refresh/", {}, HttpMethod.POST);
};
