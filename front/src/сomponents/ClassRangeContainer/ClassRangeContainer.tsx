import { IClassRange } from "../../interfaces/IClassRange";
import { ClassRangeItem } from "../ClassRangeItem/ClassRangeItem";
import useLocalStorage from "use-local-storage";
import "./ClassRangeContainer.css";
import React from "react";
import { useGetClassRanges } from "../../hooks/useGetClassRanges.js";

interface IClassRangeContainerProps {}

export const ClassRangeContainer = (props: IClassRangeContainerProps) => {
    const classRangesApi = useGetClassRanges();
    const [selectedClassRange, setSelectedClassRange] = useLocalStorage("selected_class_range", "");

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
