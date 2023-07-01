import React, { useLayoutEffect, useState } from "react";

import plusImg from "../../assets/plus.svg";
import removeImg from "../../assets/remove.svg";

import dayFetch from "../../fetches/dayFetch";
import setDayFetch from "../../fetches/setDayFetch";
import ILesson from "../../interfaces/ILesson";

import "./DaySchedule.css";

interface IDayParams {
    dow: number;
    weekDates: number[];
}

const weekDays = [
    "Понедельник",
    "Вторник",
    "Среда",
    "Четверг",
    "Пятница",
    "Суббота",
    "Воскресенье",
];

export default function DaySchedule({ dow, weekDates }: IDayParams) {
    const [lessons, setLessons] = useState<ILesson[] | null>([]);

    useLayoutEffect(() => {
        const dayFetcher = async () => {
            try {
                const lessons: ILesson[] = await dayFetch(dow);
                setLessons(lessons);
            } catch (resp) {
                console.log("err" + dow, resp);
            }
        };

        dayFetcher();
    }, [dow]);

    const pushToBack = async (less: ILesson[]) => {
        try {
            const resp: string = await setDayFetch(
                dow,
                less,
        localStorage.getItem("jwt") as string
            );

            console.log("sus" + dow, resp);
        } catch (resp) {
            console.log("err" + dow, resp);
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
        console.log(lessons);
    };

    const addLesson = async () => {
        const awaitedState = await new Promise<ILesson[]>((resolve) => {
            setLessons((prevState: ILesson[] | null) => {
                const updatedState = prevState == null ? [] : [...prevState];
                updatedState.push({
                    start: "10:00",
                    end: "11:00",
                });
                resolve(updatedState);
                return updatedState;
            });
        });
        await pushToBack(awaitedState);
        console.log(lessons);
    };

    const removeLesson = async (order: number) => {
        const awaitedState = await new Promise<ILesson[]>((resolve) => {
            setLessons((prevState: ILesson[] | null) => {
                const updatedState =
          prevState == null
              ? []
              : prevState.filter((_, index) => index !== order);

                resolve(updatedState);
                return updatedState;
            });
        });

        await pushToBack(awaitedState);
        console.log(lessons);
    };

    return (
        <div className="daySchedule" id="first-day">
            <div className="daySchedule_top">
                <p className="static">Расписание</p>
                <p className="name">
                    <span>{weekDays[dow]}</span>
                    <span>{weekDates[dow]}</span>
                </p>
            </div>
            <div className="daySchedule_items_wrapper">
                {lessons?.map((obj: ILesson, key) => {
                    return (
                        <div className="lesson" key={key}>
                            <div className="left">
                                <p className="number">{key + 1}-й</p>
                            </div>
                            <div className="right">
                                <div className="time">
                                    <input
                                        type="time"
                                        className="les_time les_time_left"
                                        value={lessons[key].start}
                                        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                            changeTime(key, false, event.target.value)
                                        }
                                    />
                                    <p className="wall">:</p>
                                    <input
                                        type="time"
                                        className="les_time les_time_right"
                                        value={lessons[key].end}
                                        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                            changeTime(key, true, event.target.value)
                                        }
                                    />
                                </div>
                                <div className="remove">
                                    <button
                                        onClick={() => {
                                            removeLesson(key);
                                        }}
                                    >
                                        <img className="remove" src={removeImg} alt="img" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
            <div className="add">
                <button onClick={addLesson}>
                    <img src={plusImg} className="add" alt="img" />
                </button>
            </div>
        </div>
    );
}