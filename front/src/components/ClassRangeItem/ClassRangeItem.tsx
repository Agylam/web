import "./ClassRangeItem.css";
import { IClassRangeState } from "../../interfaces/IClassRange";

export interface IClassRangeItemProps {
    data: IClassRangeState;
    onUpdateClassRange: (uuid: string) => void;
}

export const ClassRangeItem = (props: IClassRangeItemProps) => {
    return (
        <div
            className={"class_range" + (props.data.active ? " active" : "")}
            onClick={() => props.onUpdateClassRange(props.data.uuid)}
        >
            <p className={"class_range_name"}>{props.data.name}</p>
        </div>
    );
};
