import React, { useState } from "react";
import { useJwt } from "react-jwt";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import "../css/index.css";

import logoImg from "../assets/logo.svg";

import IUser from "../interfaces/IUser";
import ThemeSwitcher from "../сomponents/ThemeSwitcher/ThemeSwitcher";
import authFetch from "../fetches/authFetch";

export default function IndexPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    //fixme лучше такие штуки выносить из компонентов, много места занимают
    const auth = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            // need to change email of users in database for email-like (qwerty@qwerty.com) format
            const token: string = await authFetch(email, password);
            localStorage.setItem("jwt", token);
            toast.success("Успешно!", {
                position: toast.POSITION.BOTTOM_LEFT,
                autoClose: 1000,
                onClose: () => {
                    navigate("/schedule");
                },
            });
        } catch (e) {
            toast.error("Неверные почта или пароль!", {
                position: toast.POSITION.BOTTOM_LEFT,
                autoClose: 2000,
            });
        }
    };

    const { isExpired } = useJwt<IUser>(localStorage.getItem("jwt") as string);
    //fixme лучше никогда не писать if без {}
    if (!isExpired) navigate("/schedule");
    //fixme выглядит так, что это можно разделить на компоненты сильнее
    return (
        <div className="wrapper">
            <ToastContainer limit={3} />
            <form id="auth" onSubmit={auth}>
                <img src={logoImg} alt="" id="logo" />
                <div id="auth_inputs">
                    <input
                        type="email"
                        id="email"
                        className="auth_inp"
                        required
                        placeholder="Почта"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                    />
                    <input
                        type="password"
                        id="password"
                        className="auth_inp"
                        required
                        placeholder="Пароль"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                    />
                    <button id="button" type="submit">
                        Войти
                    </button>
                </div>
                <p id="rem_pass">
                    Для смены пароля свяжитесь с <span className="mimbol">@mimbol</span>
                </p>
                <ThemeSwitcher/>
            </form>
        </div>
    );
}
