import { fetcher } from "../utils/fetcher";

export const apiFetcher = () => fetcher(JSON.parse(localStorage.getItem("accessToken") || "\"\""));
