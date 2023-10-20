import React from "react";

import "../css/schedule.css";

import DaySchedule from "../сomponents/DaySchedule/DaySchedule";
import NavbarComponent from "../сomponents/Navbar/Navbar";
import { useWeekDates } from "./hooks/useWeekDates";
import { useUserInfo } from "../hooks/useUserInfo";
import { ClassRangeContainer } from "../сomponents/ClassRangeContainer/ClassRangeContainer.js";

export default function SchedulePage() {
    const weekDates = useWeekDates();
    const userInfo = useUserInfo();

    return (
        <>
            <NavbarComponent userInfo={userInfo} />
            <ClassRangeContainer />
            <div className="days_wrapper" style={{ overflow: "auto" }}>
                {Array.from(Array(7).keys()).map((e, k) => (
                    <DaySchedule key={k} dow={k} weekDates={weekDates} />
                ))}
            </div>
        </>
    );
}
