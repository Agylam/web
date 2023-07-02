import React from "react";
import TimeInput from "../TimeInput/TimeInput";

import cl from "./TimeRange.module.css";

interface TimeRangeComponentParams {
    timeRange: {
        start: string;
        end: string;
    };
    changeTime: (type: boolean, time: string) => void
}

export default function TimeRangeComponent({timeRange, changeTime}: TimeRangeComponentParams) {
    return (
        <div className={cl.time_range}>
            <TimeInput
                value={timeRange.start}
                onChange={(event) => changeTime(false, event.target.value)}/>
            <p className={cl.time_range_wall}>:</p>
            <TimeInput
                value={timeRange.end}
                onChange={(event) => changeTime(true, event.target.value)}/>
        </div>
    );
}