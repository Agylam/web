export interface IUser{
    id:number;
    email:string;
    fullName: string;
}
export interface IDBUser extends IUser{
    password: string;
}