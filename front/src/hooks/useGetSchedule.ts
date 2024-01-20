import useSWR from "swr";
import LessonTime from "../interfaces/LessonTime";

export const useGetSchedule = (class_range: string, day: number) => useSWR<LessonTime[]>(`/schedule/${class_range}/${day}`);
