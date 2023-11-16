import { useJwtContext } from "../context/jwt-context";
import useSWR from "swr";
import { fetcher } from "../utils/fetcher";

export const useGetSchedule = (class_range: string, day: number) => {
    const { jwts } = useJwtContext();
    const schedule = useSWR([`/schedule/${class_range}/${day}`, jwts.accessToken], fetcher);
    if (schedule.error) {
        console.error(schedule.error);
    }
    return schedule;
};
