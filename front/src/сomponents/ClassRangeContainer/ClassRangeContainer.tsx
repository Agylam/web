import { IClassRange } from "../../interfaces/IClassRange";
import { ClassRangeItem } from "../ClassRangeItem/ClassRangeItem";
import "./ClassRangeContainer.css";
import React from "react";
import { useGetClassRanges } from "../../hooks/useGetClassRanges.js";

interface IClassRangeContainerProps {
    selectedClassRange: string;
    setSelectedClassRange: React.Dispatch<React.SetStateAction<string | undefined>>;
}

export const ClassRangeContainer = ({ selectedClassRange, setSelectedClassRange }: IClassRangeContainerProps) => {
    const classRangesApi = useGetClassRanges();

    return (
        <div className="class_range_wrapper">
            {classRangesApi.error && <p>Ошибка загрузки classRanges</p>}
            {!classRangesApi.error &&
                !classRangesApi.isLoading &&
                classRangesApi.data?.map((cr: IClassRange) => (
                    <ClassRangeItem
                        data={{ ...cr, active: cr.uuid === selectedClassRange }}
                        key={cr.uuid}
                        onUpdateClassRange={(uuid) => {
                            setSelectedClassRange(uuid);
                        }}
                    />
                ))}
        </div>
    );
};
