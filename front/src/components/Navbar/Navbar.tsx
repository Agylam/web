import React from "react";
import "./Navbar.scss";
import { logOut } from "../../utils/logOut";
import { NavbarLink } from "../NavbarLink/NavbarLink";
import logoImg from "../../assets/logo.svg";
import { useUserInfo } from "../../hooks/useUserInfo";

export const Navbar = () => {
    const userInfo = useUserInfo();

    return (
        <div className="nav_wrapper">
            <div className="left_nav">
                <img src={logoImg} alt="" id="nav_logo" />
                <nav>
                    <ul>
                        <NavbarLink name="Расписание" uri="/schedule" />
                        <NavbarLink name="Объявления" uri="/announcement" />
                        <NavbarLink name="Пользователи" uri="" />
                        <NavbarLink name="Файл" uri="" />
                    </ul>
                </nav>
            </div>
            <div className="right_nav">
                <p className="name">{userInfo?.fullname}</p>
                <button id="exit" onClick={logOut}>
                    Выйти
                </button>
            </div>
        </div>
    );
};
