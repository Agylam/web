import { useJwtContext } from "../context/jwt-context.js";
import useSWR from "swr";
import { fetcher } from "../utils/fetcher.js";

export const useGetClassRanges = () => {
    const { jwts } = useJwtContext();
    const classRanges = useSWR(["/class_range", jwts.accessToken], fetcher);
    if (classRanges.error) {
        console.error(classRanges.error);
    }
    return classRanges;
};