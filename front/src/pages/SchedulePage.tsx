import React, {useEffect, useRef, useState} from "react";
import {useJwt} from "react-jwt";
import {useNavigate} from "react-router-dom";
import "../css/schedule.css";
import IUser from "../interfaces/IUser";
import DaySchedule from "../сomponents/DaySchedule/DaySchedule";
import NavbarComponent from "../сomponents/Navbar/Navbar";
import { useWeekDates } from "./hooks/useWeekDates";

export function useHorizontalScroll() {
    const elRef = useRef<null | HTMLDivElement>(null);
    useEffect(() => {
        const el = elRef.current;
        if (el) {
            const onWheel = (e: { deltaY: number; preventDefault: () => void; }) => {
                if (e.deltaY == 0){
                    return;
                }
                e.preventDefault();
                el.scrollTo({
                    left: el.scrollLeft + e.deltaY * 3,
                    behavior: "smooth"
                });
            };
            el.addEventListener("wheel", onWheel);
            return () => el.removeEventListener("wheel", onWheel);
        }
    }, []);
    return elRef;
}

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
    const scrollRef = useHorizontalScroll();

    return (
        <>
            <NavbarComponent
                userInfo={userInfo}
            />
            <div className="days_wrapper" ref={scrollRef} style={{overflow: "auto"}}>
                {days.map((e, k) => {
                    return <DaySchedule key={k} dow={k} weekDates={weekDates} />;
                })}
            </div>
        </>
    );
}
