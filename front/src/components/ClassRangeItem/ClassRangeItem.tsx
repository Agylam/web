import React from "react";
import "./ClassRangeItem.css";
import { ClassRangeState } from "../../interfaces/ClassRange";

export interface IClassRangeItemProps {
    data: ClassRangeState;
    onUpdateClassRange: (uuid: string) => void;
}

export const ClassRangeItem = (props: IClassRangeItemProps) => {
    return (
        <button
            className={"class_range" + (props.data.active ? " active" : "")}
            onClick={() => props.onUpdateClassRange(props.data.uuid)}
        >
            <p className={"class_range_name"}>{props.data.name}</p>
        </button>
    );
};
