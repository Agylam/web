import { ClassRange } from "../../interfaces/ClassRange";
import { ClassRangeItem } from "../ClassRangeItem/ClassRangeItem";
import "./ClassRanges.scss";
import React, { useLayoutEffect } from "react";
import { useGetClassRanges } from "../../hooks/useGetClassRanges";

interface IClassRangeContainerProps {
    selectedClassRange: string;
    setSelectedClassRange: React.Dispatch<React.SetStateAction<string | undefined>>;
}

export const ClassRanges = ({ selectedClassRange, setSelectedClassRange }: IClassRangeContainerProps) => {
    const classRangesApi = useGetClassRanges();

    useLayoutEffect(() => {
        if (!classRangesApi.error && !classRangesApi.isLoading && classRangesApi.data?.length !== 0 && selectedClassRange.length === 0) {
            setSelectedClassRange(classRangesApi.data?.[0].uuid);
        }
    }, [classRangesApi.error, classRangesApi.isLoading, classRangesApi.data, setSelectedClassRange]);

    return (
        <div className="class_range_wrapper">
            {classRangesApi.error && <p>Ошибка загрузки classRanges</p>}
            {!classRangesApi.error &&
                !classRangesApi.isLoading &&
                classRangesApi.data?.map((cr: ClassRange) => (
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
