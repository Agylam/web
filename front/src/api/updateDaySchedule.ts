import LessonTime from "../interfaces/LessonTime";
import { fetcher, HttpMethod } from "../utils/fetcher";

export const updateDaySchedule = (class_range: string, dayOfWeek: number, lessons: LessonTime[]) => {
    return fetcher<LessonTime[]>([`/schedule/${class_range}/${dayOfWeek}`], lessons, HttpMethod.PUT);
};