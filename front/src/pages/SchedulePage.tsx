import React, {useState} from "react";
import {useJwt} from "react-jwt";
import {useNavigate} from "react-router-dom";

import "../css/schedule.css";

import IUser from "../interfaces/IUser";
import DaySchedule from "../сomponents/DaySchedule/DaySchedule";
import NavbarComponent from "../сomponents/Navbar/Navbar";
import { useWeekDates } from "./hooks/useWeekDates";

export default function SchedulePage() {
    const [days] = useState([[], [], [], [], [], [], []]);
    const weekDates = useWeekDates();
    const {decodedToken, isExpired} = useJwt<IUser>(
        localStorage.getItem("jwt") as string
    );
    const navigate = useNavigate();
    const exit = () => {
        localStorage.removeItem("jwt");
        navigate("/");
    };
    if (isExpired) {
        exit();
    }
    const userInfo = decodedToken;

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
