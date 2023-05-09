export interface ILesson {
    start: string;
    end: string;
}
export interface ILessonDB extends ILesson{
    id:number;
    day:number;
}