import React from "react";

import logoImg from "../../assets/logo.svg";

import IUser from "../../interfaces/IUser";

import "./Navbar.css";
import { logOut } from "../../utils/jwts";
import { NavbarElement } from "../NavbarElement/NavbarElement";

interface INavbarParams {
    userInfo: IUser | null;
}

export default function Navbar({ userInfo }: INavbarParams) {
    return (
        <div className="nav_wrapper">
            <div className="left_nav">
                <img
                    src={logoImg}
                    alt=""
                    id="nav_logo"
                />
                <nav>
                    <ul>
                        <NavbarElement name="Расписание" uri="/schedule" />
                        <NavbarElement name="Объявления" uri="/announcement" />
                        <NavbarElement name="Пользователи" uri="" />
                        <NavbarElement name="Файл" uri="" />
                    </ul>
                </nav>
            </div>
            <div className="right_nav">
                <p className="name">{userInfo?.fullname}</p>
                <button
                    id="exit"
                    onClick={logOut}>
                    Выйти
                </button>
            </div>
        </div>
    );
}
