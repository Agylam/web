import React from "react";

import cl from "./TimeInput.module.css";

interface TimeInputComponentParams {
    value: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export default function TimeInput({value, onChange}: TimeInputComponentParams) {
    return (
        <input
            type="time"
            className={cl.time_input}
            value={value}
            onChange={onChange}
        />
    );
}