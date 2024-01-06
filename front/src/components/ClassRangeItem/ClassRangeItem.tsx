import React from "react";
import "./ClassRangeItem.scss";
import { ClassRangeState } from "../../interfaces/ClassRange";

export interface IClassRangeItemProps {
    data: ClassRangeState;
    onUpdateClassRange: (uuid: string) => void;
}

export const ClassRangeItem = (props: IClassRangeItemProps) => {
    const onClassRangeClick = () => {
        props.onUpdateClassRange(props.data.uuid);
    };

    return (
        <button
            className={"class_range" + (props.data.active ? " active" : "")}
            onClick={onClassRangeClick}
        >
            <p className={"class_range_name"}>{props.data.name}</p>
        </button>
    );
};
