import { useJwtContext } from "../jwt-context";
import useSWR from "swr";
import { fetcher } from "../utils/fetcher";
import { ClassRange } from "../interfaces/ClassRange";

export const useGetClassRanges = () => {
    const { accessToken } = useJwtContext();
    const classRanges = useSWR(["/class_range", accessToken], fetcher<ClassRange[]>);
    if (classRanges.error) {
        console.error(classRanges.error);
    }
    return classRanges;
};
