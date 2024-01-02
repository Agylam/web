import React, { useCallback, useState } from "react";
import "./AuthForm.scss";
import logoImg from "../../assets/logo.svg";
import Input from "../UI/Input";
import Button from "../UI/Button";
import { useNavigate } from "react-router-dom";
import { useJwtContext } from "../../context/jwt-context";
import authFetch from "../../fetches/authFetch";
import { toast } from "react-toastify";
import { PagePath } from "../../constants";

export const AuthForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const { setJwts } = useJwtContext();

    //fixme лучше такие штуки выносить из компонентов, много места занимают
    const auth = useCallback(
        async (e: React.FormEvent) => {
            e.preventDefault();
            try {
                const jwt = await authFetch(email, password);
                setJwts(jwt);
                toast.success("Успешно!", {
                    position: toast.POSITION.BOTTOM_LEFT,
                    autoClose: 1000,
                    onClose: () => {
                        navigate(PagePath.schedule);
                    }
                });
            } catch (e) {
                toast.error("Неверные почта или пароль!", {
                    position: toast.POSITION.BOTTOM_LEFT,
                    autoClose: 2000
                });
            }
        },
        [email, password, navigate, setJwts]
    );

    return (
        <div className="auth_block">
            <form id="auth" onSubmit={auth}>
                <img src={logoImg} alt="" id="logo" />
                <div className="auth_inputs">
                    <Input
                        type="email"
                        required
                        placeholder="Почта"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                    />
                    <Input
                        type="password"
                        required={true}
                        placeholder="Пароль"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                    />
                    <Button type="submit">
                        Войти
                    </Button>
                </div>
                <p className="conditions">
                    Нажимая кнопку «Войти», вы соглашаетесь с <a href="/rules">правилами пользования</a> сайтом
                </p>
            </form>
        </div>
    );
};