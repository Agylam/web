export interface ClassRange {
    uuid: string;
    name: string;
    end_sound: {
        uuid: string;
    };
    start_sound: {
        uuid: string;
    };
}

export interface ClassRangeState extends ClassRange {
    active: boolean;
}