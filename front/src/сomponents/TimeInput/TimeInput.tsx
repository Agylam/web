import React from "react";

import "./TimeInput.css";

interface TimeInputComponentParams {
    value: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export default function TimeInput({value, onChange}: TimeInputComponentParams) {
    return (
        <input
            type="time"
            className="time_input"
            value={value}
            onChange={onChange}
        />
    );
}