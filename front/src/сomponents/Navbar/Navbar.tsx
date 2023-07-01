import React from "react"
import {useNavigate} from "react-router-dom";

import logoImg from "../../assets/logo.svg";

import IUser from "../../interfaces/IUser";

import "./Navbar.css";

interface INavbarParams {
    userInfo: IUser | null;
}

export default function Navbar({userInfo}: INavbarParams) {
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
                <nav>
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
        </div>
    );
}
