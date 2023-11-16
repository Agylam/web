import React, { useLayoutEffect, useState } from "react";

import plusImg from "../../assets/plus.svg";
import setDayFetch from "../../fetches/setDayFetch";
import ILesson from "../../interfaces/ILesson";

import "./DaySchedule.css";
import { useGetSchedule } from "../../hooks/useGetSchedule";
import { useJwtContext } from "../../context/jwt-context";
import DayScheduleItem from "../DayScheduleItem/DayScheduleItem";

interface IDayScheduleProps {
    dow: number;
    weekDates: number[];
    class_range: string;
}

const weekDays = ["Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота", "Воскресенье"];

export default function DaySchedule({ dow, weekDates, class_range }: IDayScheduleProps) {
    const [lessons, setLessons] = useState<ILesson[] | null>([]);
    const schedule = useGetSchedule(class_range, dow);
    const { jwts } = useJwtContext();

    useLayoutEffect(() => {
        if (!schedule.error && !schedule.isLoading) {
            setLessons(schedule.data);
        }
    }, [schedule]);

    const pushToBack = async (less: ILesson[]) => {
        try {
            await setDayFetch(class_range, dow, less, jwts.accessToken);
            await schedule.mutate();
        } catch (resp) {
            console.log("err" + dow);
        }
    };

    const changeTime = async (order: number, type: boolean, time: string) => {
        const awaitedState = await new Promise<ILesson[]>((resolve) => {
            setLessons((prevState: ILesson[] | null) => {
                let updatedState: ILesson[] = [];
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
        const awaitedState = await new Promise<ILesson[]>((resolve) => {
            setLessons((prevState: ILesson[] | null) => {
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
        const awaitedState = await new Promise<ILesson[]>((resolve) => {
            setLessons((prevState: ILesson[] | null) => {
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
                            <span>{weekDates[dow]}</span>
                        </p>
                    </div>
                    <div className="daySchedule_items_wrapper">
                        {lessons?.map((les: ILesson, key) =>
                            <DayScheduleItem
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