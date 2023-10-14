import React, { useState } from "react";

import "../css/schedule.css";

import DaySchedule from "../сomponents/DaySchedule/DaySchedule";
import NavbarComponent from "../сomponents/Navbar/Navbar";
import { useWeekDates } from "./hooks/useWeekDates";
import { useUserInfo } from "../hooks/useUserInfo";
import { IClassRangeState } from "../interfaces/IClassRange";
import { ClassRangeItem } from "../сomponents/ClassRangeItem/ClassRangeItem";

export default function SchedulePage() {
	//fixme выглядит, как костыль
	const [days] = useState([[], [], [], [], [], [], []]);

	const [classRanges, setClassRanges] = useState<IClassRangeState[]>([]);

	const weekDates = useWeekDates();
	const userInfo = useUserInfo();

	return (
		<>
			<NavbarComponent
				userInfo={userInfo}
			/>
			<div className="class_range_wrapper">
				{
					classRanges.map(
						(e, k) => <ClassRangeItem />
					)
				}
			</div>
			<div className="days_wrapper" style={{ overflow: "auto" }}>
				{days.map(
					(e, k) => <DaySchedule key={k} dow={k} weekDates={weekDates} />
				)}
			</div>
		</>
	);
}
