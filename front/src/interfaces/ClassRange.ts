export interface ClassRange {
    uuid: string;
    name: string;
}

export interface ClassRangeState extends ClassRange {
    active: boolean;
}