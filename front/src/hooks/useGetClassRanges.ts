import useSWR from "swr";
import { ClassRange } from "../interfaces/ClassRange";

export const useGetClassRanges = () => useSWR<ClassRange[]>("/class_range");
