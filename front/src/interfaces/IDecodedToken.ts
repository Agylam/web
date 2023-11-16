export interface IUserRole {
    id: number;
    name: string;
    description: string;
}

export interface IUserSchool {
    uuid: string;
}

export interface IDecodedToken {
    email: string;
    uuid: string;
    fullname: string;
    roles: IUserRole[];
    school: IUserSchool[];
}