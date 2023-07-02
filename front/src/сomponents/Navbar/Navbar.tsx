import React from "react"
import { useNavigate } from "react-router-dom";
import logoImg from "../../assets/logo.svg";
import IUser from "../../interfaces/IUser";

import cl from "./Navbar.module.css";

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
        <div className={cl.nav_wrapper}>
            <div className={cl.left_nav}>
                <img
                    src={logoImg}
                    alt=""
                    id="nav_logo"
                />
                <nav>
                    <ul>
                        <li className={[cl.nav_item, cl.active].join(' ')}>Расписание</li>
                        <li className={cl.nav_item}>Объявления</li>
                        <li className={cl.nav_item}>Пользователи</li>
                        <li className={cl.nav_item}>Файл</li>
                    </ul>
                </nav>
            </div>
            <div className={cl.right_nav}>
                <p className={cl.name}>{userInfo?.fullName}</p>
                <button
                    id="exit"
                    onClick={exit}>
                    Выйти
                </button>
            </div>
        </div>
    );
}
