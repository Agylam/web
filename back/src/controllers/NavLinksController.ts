import {Get, JsonController} from "routing-controllers";
interface INavLink {
    id: number;
    url: string;
    name: string;
    perm: number;
}
@JsonController("")
export class NavLinksController {
    @Get("/navlinks")
    navlinks(){
        const response : INavLink[] = [
            {
                "id": 0,
                "name": "Расписание",
                "perm": 0,
                "url": "/schedule"
            },
            {
                "id": 1,
                "name": "Объявления",
                "perm": 0,
                "url": "/ads"
            },
            {
                "id": 2,
                "name": "Пользователи",
                "perm": 0,
                "url": "/users"
            },
            {
                "id": 3,
                "name": "Файл",
                "perm": 0,
                "url": "/file"
            },
        ]
        return response
    }
}