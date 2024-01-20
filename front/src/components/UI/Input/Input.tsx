import React from "react";
import "./Input.scss";

interface InputProps {
    type: string;
    placeholder: string;
    value: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    isDisabled?: boolean;
    isInvalid?: boolean;
    required?: boolean;
}

const Input = (props: InputProps) => {
    let inputClass = "input";
    if (props.isInvalid) {
        inputClass += " input_invalid";
    }

    return (
        <input
            className={inputClass}
            type={props.type}
            placeholder={props.placeholder}
            value={props.value}
            onChange={props.onChange}
            disabled={props.isDisabled}
            required={props.required}
        />
    );
};

export default Input;