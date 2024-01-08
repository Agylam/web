import LessonTime from "../interfaces/LessonTime";
import { HttpMethod } from "../utils/fetcher";
import { apiFetcher } from "./apiFetcher";

export const updateDaySchedule = (class_range: string, dayOfWeek: number, lessons: LessonTime[]) => {
    return apiFetcher<LessonTime[]>(`/schedule/${class_range}/${dayOfWeek}`, lessons, HttpMethod.PUT);
};