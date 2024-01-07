import React from "react";

import TimeInput from "../UI/TimeInput/TimeInput";

import "./TimeRange.scss";

interface TimeRangeComponentParams {
    timeRange: {
        start: string;
        end: string;
    };
    changeTime: (type: boolean, time: string) => void;
}

export default function TimeRangeComponent({ timeRange, changeTime }: TimeRangeComponentParams) {
    return (
        <div className="time_range">
            <TimeInput
                value={timeRange.start}
                onUpdateValue={(value) => changeTime(false, value)} />
            <p className="time_range_wall">:</p>
            <TimeInput
                value={timeRange.end}
                onUpdateValue={(value) => changeTime(true, value)} />
        </div>
    );
}