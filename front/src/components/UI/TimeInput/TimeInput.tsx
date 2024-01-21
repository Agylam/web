import React, { useEffect, useState } from "react";
import "./TimeInput.scss";

interface TimeInputComponentParams {
    value: string;
    onUpdateValue?: (event: string) => void;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function TimeInput({ value, onUpdateValue, onChange }: TimeInputComponentParams) {
    const [timeValue, setTimeValue] = useState("10:00");

    useEffect(() => {
        setTimeValue(value);
    }, [value, setTimeValue]);

    const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTimeValue(e.target.value);
        if (onChange) {
            onChange(e);
        }
    };

    const onBlur = () => {
        if (onUpdateValue) {
            onUpdateValue(timeValue);
        }
    };

    return <input type="time" className="time_input" value={timeValue} onChange={onChangeInput} onBlur={onBlur} />;
}
