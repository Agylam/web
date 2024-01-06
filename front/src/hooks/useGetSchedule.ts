import { useJwtContext } from "../jwt-context";
import useSWR from "swr";
import { fetcher } from "../utils/fetcher";
import LessonTime from "../interfaces/LessonTime";

export const useGetSchedule = (class_range: string, day: number) => {
    const { accessToken } = useJwtContext();
    const schedule = useSWR([`/schedule/${class_range}/${day}`, accessToken], fetcher<LessonTime[]>);
    if (schedule.error) {
        console.error(schedule.error);
    }
    return schedule;
};
