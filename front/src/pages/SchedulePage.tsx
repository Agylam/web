import React, {useState} from "react";

import "../css/schedule.css";

import DaySchedule from "../сomponents/DaySchedule/DaySchedule";
import NavbarComponent from "../сomponents/Navbar/Navbar";
import { useWeekDates } from "./hooks/useWeekDates";
import { useUserInfo } from "../hooks/useUserInfo";

export default function SchedulePage() {
    const [days] = useState([[], [], [], [], [], [], []]);
    const weekDates = useWeekDates();
    const userInfo = useUserInfo();

    return (
        <>
            <NavbarComponent
                userInfo={userInfo}
            />
            <div className="days_wrapper" style={{overflow: "auto"}}>
                {days.map(
                    (e, k) =><DaySchedule key={k} dow={k} weekDates={weekDates} />
                )}
            </div>
        </>
    );
}
