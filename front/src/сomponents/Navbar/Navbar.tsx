import React, { useState } from "react"
import { useNavigate } from "react-router-dom";

import logoImg from "../../assets/logo.svg";

import IUser from "../../interfaces/IUser";

import "./Navbar.css";

interface INavbarParams {
    userInfo: IUser | null;
}

export default function Navbar({ userInfo }: INavbarParams) {

    const [burgerIsOpen, setBurgerOpen] = useState<boolean>(false);
    const navigate = useNavigate();
    const exit = () => {
        localStorage.removeItem("jwt");
        navigate("/");
    };

    return (
        <div className="nav_wrapper">
            <div className="left_nav">
                <img
                    src={logoImg}
                    alt=""
                    id="nav_logo"
                />
                <nav className="nav_menu">
                    <ul>
                        <li className="nav_item active">Расписание</li>
                        <li className="nav_item">Объявления</li>
                        <li className="nav_item">Пользователи</li>
                        <li className="nav_item">Файл</li>
                    </ul>
                </nav>
            </div>
            <div className="right_nav">
                <p className="name">{userInfo?.fullName}</p>
                <button
                    id="exit"
                    onClick={exit}>
                    Выйти
                </button>
            </div>
            <div className="burger">

                <button className="burger_btn" onClick={() => setBurgerOpen(!burgerIsOpen)} >
                    <span className="burger_icon"></span>
                    <span className="burger_icon"></span>
                    <span className="burger_icon"></span>
                </button>

                <div className={burgerIsOpen ? "burger_menu burger_menu_open" : "burger_menu"}>
                    <li className="nav_item active">Расписание</li>
                    <li className="nav_item">Объявления</li>
                    <li className="nav_item">Пользователи</li>
                    <li className="nav_item">Файл</li>
                    <div className="burger_menu_flex">
                        <p className="name">{userInfo?.fullName}</p>
                        <button
                            id="exit"
                            onClick={exit}>
                            Выйти
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}