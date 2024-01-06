import React from "react";

import removeImg from "../../assets/remove.svg";

import LessonTime from "../../interfaces/LessonTime";
import TimeRangeComponent from "../TimeRange/TimeRange";

import "./Lesson.scss";

interface LessonComponentProps {
    index: number;
    lesson: LessonTime;
    timeManage: {
        set: (key: number, type: boolean, time: string) => void;
        remove: (key: number) => void;
    };
}

export default function Lesson({ index, lesson, timeManage }: LessonComponentProps) {
    return (
        <div className="lesson" key={index}>
            <div className="left">
                <p className="number">{index + 1}-й</p>
            </div>
            <div className="right">
                <TimeRangeComponent changeTime={(type, time) => {
                    timeManage.set(index, type, time);
                }} timeRange={lesson} />
                <div className="remove">
                    <button
                        onClick={() => timeManage.remove(index)}
                    >
                        <img
                            className="remove"
                            src={removeImg}
                            alt="img"
                        />
                    </button>
                </div>
            </div>
        </div>
    );
}