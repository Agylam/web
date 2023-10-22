import React from "react";

import "../css/schedule.css";

import DaySchedule from "../сomponents/DaySchedule/DaySchedule";
import NavbarComponent from "../сomponents/Navbar/Navbar";
import { useWeekDates } from "./hooks/useWeekDates";
import { useUserInfo } from "../hooks/useUserInfo";
import { ClassRangeContainer } from "../сomponents/ClassRangeContainer/ClassRangeContainer.js";
import useLocalStorage from "use-local-storage";

export default function SchedulePage() {
    const weekDates = useWeekDates();
    const userInfo = useUserInfo();

    const [selectedClassRange, setSelectedClassRange] = useLocalStorage("selected_class_range", "");

    return (
        <>
            <NavbarComponent userInfo={userInfo} />
            <ClassRangeContainer
                selectedClassRange={selectedClassRange}
                setSelectedClassRange={setSelectedClassRange}
            />
            <div className="days_wrapper" style={{ overflow: "auto" }}>
                {Array.from(Array(7).keys()).map((e, k) => (
                    <DaySchedule key={k} dow={k} weekDates={weekDates} class_range={selectedClassRange} />
                ))}
            </div>
        </>
    );
}
