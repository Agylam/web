import React from "react";
import removeImg from "../../assets/remove.svg";
import ILesson from "../../interfaces/ILesson";
import TimeRangeComponent from "../TimeRange/TimeRange";

import "./DayScheduleItem.css";

interface LessonComponentParams {
    index: number;
    lesson: ILesson;
    timeManage: {
        set: (key: number, type: boolean, time: string) => void;
        remove: (key: number) => void;
    }
}

export default function DayScheduleItem({index, lesson, timeManage}: LessonComponentParams) {
    return (
        <div className="dayScheduleItem" key={index}>
            <div className="left">
                <p className="number">{index + 1}-й</p>
            </div>
            <div className="right">
                <TimeRangeComponent changeTime={(type, time) => {
                    timeManage.set(index, type, time)
                }} timeRange={lesson}/>
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