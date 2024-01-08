import { fetcher } from "../utils/fetcher";

export const apiFetcher = fetcher(localStorage.accessToken ? JSON.parse(localStorage.accessToken) : "");