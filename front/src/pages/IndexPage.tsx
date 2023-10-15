import React, { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import "../css/index.css";

import logoImg from "../assets/logo.svg";
import authFetch from "../fetches/authFetch";
import { PagePath } from "../constants";
import { useJwtContext } from "../context/jwt-context";

export default function IndexPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const { setJwts } = useJwtContext();

    //fixme лучше такие штуки выносить из компонентов, много места занимают
    const auth = useCallback(
        async (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            try {
                // need to change email of users in database for email-like (qwerty@qwerty.com) format
                const jwt = await authFetch(email, password);
                setJwts(jwt);
                toast.success("Успешно!", {
                    position: toast.POSITION.BOTTOM_LEFT,
                    autoClose: 1000,
                    onClose: () => {
                        navigate(PagePath.schedule);
                    },
                });
            } catch (e) {
                toast.error("Неверные почта или пароль!", {
                    position: toast.POSITION.BOTTOM_LEFT,
                    autoClose: 2000,
                });
            }
        },
        [email, password, navigate, setJwts]
    );

    //fixme выглядит так, что это можно разделить на компоненты сильнее
    return (
        <div className="auth_container">
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
                </form>
            </div>
        </div>
    );
}
