import {BadRequestError, Body, CurrentUser, Get, JsonController, Param, Put} from 'routing-controllers';
import 'reflect-metadata'
import {DatabaseMim} from "../db.js";
import {IUser} from "../interfaces/IUser.js";
import {ILesson} from "../interfaces/ILesson.js";

const DB = new DatabaseMim(process.env.DB_PATH as string);

@JsonController('/schedule')
export class ScheduleController {
    @Put('/:day')
    async save(@CurrentUser({required: true}) user: IUser, @Body() lessons: ILesson[], @Param('day') day: number) {
        if (day < 0 || day > 6 || isNaN(day)) throw new BadRequestError("Day may be only 0-6 number");
        const notValid = lessons.filter(e => {
            return typeof (e.start) !== "string" || typeof (e.end) !== "string" || Object.keys(e).length !== 2;
        })
        if (notValid.length != 0) throw new BadRequestError("Element " + JSON.stringify(notValid[0]) + " isn't lesson");
        const SqlQuery = "INSERT INTO schedule (day, start,end) VALUES " + lessons.map(() => "(?,?,?) ").join();
        const params = lessons.map(e => [day, e.start, e.end]).reduce(
            (accumulator, currentValue) => accumulator.concat(currentValue),
            []
        ) as string[];
        console.log(SqlQuery, params, day);
        return DB.query("DELETE FROM schedule WHERE day = ?", [day + ""]).then(() => {
            if (lessons.length != 0) {
                console.log("Not empty");
                return DB.query(SqlQuery, params).then(() => {
                    return {message: 'Data saved to db.'};
                })
            } else {
                console.log("Empty");
                return {message: 'Data saved to db.'};
            }
        });
    }

    @Get('/:day')
    async list(@Param('day') day: number) {
        if (day < 0 || day > 6 || isNaN(day)) throw new BadRequestError("Day may be only 0-6 number");
        return await DB.all<ILesson>("SELECT * FROM schedule WHERE day = ?", [day + ""]).then(async (lessons) => {
            return lessons?.map(i => {
                return {start: i.start, end: i.end}
            });
        })
    }
}
