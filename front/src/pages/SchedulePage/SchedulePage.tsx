import React from "react";

import "./SchedulePage.scss";

import DaySchedule from "../../components/DaySchedule/DaySchedule";
import { ClassRanges } from "../../components/ClassRanges/ClassRanges";
import useLocalStorage from "use-local-storage";
import { getWeekDates } from "../../utils/getWeekDates";

export const SchedulePage = () => {
    const weekDates = getWeekDates();
    const [selectedClassRange, setSelectedClassRange] = useLocalStorage("selected_class_range", "");

    return (
        <>
            <ClassRanges selectedClassRange={selectedClassRange} setSelectedClassRange={setSelectedClassRange} />
            <div className="days_wrapper">
                {!selectedClassRange && <p className="select_class_range">Выберите класс</p>}
                {selectedClassRange &&
                    weekDates.map((e, k) => (
                        <DaySchedule key={e} dow={k} weekDate={e} class_range={selectedClassRange} />
                    ))}
            </div>
        </>
    );
};
