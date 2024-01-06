import React, { useLayoutEffect, useState } from "react";

import plusImg from "../../assets/plus.svg";
import type LessonTime from "../../interfaces/LessonTime";

import "./DaySchedule.scss";
import { useGetSchedule } from "../../hooks/useGetSchedule";
import Lesson from "../Lesson/Lesson";
import { updateDaySchedule } from "../../api/updateDaySchedule";

interface IDayScheduleProps {
    dow: number;
    weekDate: number;
    class_range: string;
}

const weekDays = ["Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота", "Воскресенье"];

export default function DaySchedule({ dow, weekDate, class_range }: IDayScheduleProps) {
    const [lessons, setLessons] = useState<LessonTime[]>([]);
    const schedule = useGetSchedule(class_range, dow);

    useLayoutEffect(() => {
        if (!schedule.error && !schedule.isLoading && schedule.data) {
            setLessons(schedule.data);
        }
    }, [schedule]);

    const pushToBack = async (less: LessonTime[]) => {
        try {
            await updateDaySchedule(class_range, dow, less);
            await schedule.mutate();
        } catch (err) {
            console.error("Day error: " + dow, "error:", err);
        }
    };

    const changeTime = async (order: number, type: boolean, time: string) => {
        const awaitedState = await new Promise<LessonTime[]>((resolve) => {
            setLessons((prevState: LessonTime[] | null) => {
                let updatedState: LessonTime[] = [];
                if (prevState != null) {
                    updatedState = prevState.map((v, k) => {
                        if (k == order) {
                            if (type) {
                                return { ...v, end: time };
                            } else {
                                return { ...v, start: time };
                            }
                        } else {
                            return v;
                        }
                    });
                }
                resolve(updatedState);
                return updatedState;
            });
        });

        await pushToBack(awaitedState);
    };

    const addLesson = async () => {
        const awaitedState = await new Promise<LessonTime[]>((resolve) => {
            setLessons((prevState: LessonTime[] | null) => {
                const updatedState = prevState == null ? [] : [...prevState];
                updatedState.push({
                    start: "10:00",
                    end: "11:00"
                });
                resolve(updatedState);
                return updatedState;
            });
        });
        await pushToBack(awaitedState);
    };

    const removeLesson = async (order: number) => {
        const awaitedState = await new Promise<LessonTime[]>((resolve) => {
            setLessons((prevState: LessonTime[] | null) => {
                const updatedState = prevState == null ? [] : prevState.filter((_, index) => index !== order);

                resolve(updatedState);
                return updatedState;
            });
        });

        await pushToBack(awaitedState);
    };

    return (
        <div className="daySchedule" id="first-day">
            {schedule.error && <p>Ошибка загрузки</p>}
            {schedule.isLoading && <p>Загрузка</p>}
            {!schedule.error && !schedule.isLoading && (
                <>
                    <div className="daySchedule_top">
                        <p className="static">Расписание</p>
                        <p className="name">
                            <span>{weekDays[dow]}</span>
                            <span>{weekDate}</span>
                        </p>
                    </div>
                    <div className="daySchedule_items_wrapper">
                        {lessons?.map((les: LessonTime, key) =>
                            <Lesson
                                key={les.uuid || key}
                                index={key}
                                lesson={les}
                                timeManage={{ set: changeTime, remove: removeLesson }} />
                        )}
                    </div>
                    <div className="add">
                        <button onClick={addLesson}>
                            <img src={plusImg} className="add" alt="img" />
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
