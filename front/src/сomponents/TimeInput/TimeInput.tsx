import React, { useEffect, useState } from "react";

import "./TimeInput.css";

interface TimeInputComponentParams {
	value: string;
	onUpdateValue: (event: string) => void;
}

export default function TimeInput({ value, onUpdateValue }: TimeInputComponentParams) {
	const [timeValue, setTimeValue] = useState("10:00");

	useEffect(() => {
		setTimeValue(value);
	}, [value, setTimeValue]);

	return (
		<input
			type="time"
			className="time_input"
			value={timeValue}
			onChange={(e) => setTimeValue(e.target.value)}
			onBlur={(e) => {
				console.log("UnFocus");
				onUpdateValue(timeValue);
			}}
		/>
	);
}