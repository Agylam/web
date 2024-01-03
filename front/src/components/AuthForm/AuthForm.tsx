import React, { useCallback, useState } from "react";
import "./AuthForm.scss";
import Input from "../UI/Input";
import Button from "../UI/Button";
import { useNavigate } from "react-router-dom";
import { useJwtContext } from "../../context/jwt-context";
import authFetch from "../../fetches/authFetch";
import { toast } from "react-toastify";
import { PagePath } from "../../constants";
import { FullLogo } from "../UI/FullLogo/FullLogo";

interface AuthData {
    email: string;
    password: string;
}

export const AuthForm = () => {
    const [authData, setAuthData] = useState<AuthData>({
        email: "",
        password: ""
    });

    const navigate = useNavigate();
    const { setAccessToken } = useJwtContext();

    //fixme лучше такие штуки выносить из компонентов, много места занимают
    const auth = useCallback(
        async (e: React.FormEvent) => {
            e.preventDefault();
            try {
                const accessToken = await authFetch(authData.email, authData.password);
                setAccessToken(accessToken);
                console.log("SET JWT", accessToken);
                navigate(PagePath.schedule);
            } catch (e) {
                toast.error("Неверные почта или пароль!", {
                    position: toast.POSITION.BOTTOM_LEFT,
                    autoClose: 2000
                });
            }
        },
        [authData?.email, authData?.password, navigate, setAccessToken]
    );

    const onChangeEmail = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setAuthData(prev => {
            return {
                ...prev,
                email: e.target.value
            };
        });
    }, []);

    const onChangePassword = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setAuthData(prev => {
            return {
                ...prev,
                password: e.target.value
            };
        });
    }, []);


    return (
        <div className="auth_block">
            <form id="auth" onSubmit={auth}>
                <FullLogo />
                <div className="auth_inputs">
                    <Input
                        type="email"
                        required
                        placeholder="Почта"
                        value={authData.email}
                        onChange={onChangeEmail}
                    />
                    <Input
                        type="password"
                        required={true}
                        placeholder="Пароль"
                        value={authData.password}
                        onChange={onChangePassword}
                    />
                    <Button type="submit">
                        Войти
                    </Button>
                </div>
                <p className="conditions">
                    Нажимая кнопку «Войти», вы соглашаетесь с
                    <a href="/rules">правилами пользования</a>
                    сайтом
                </p>
            </form>
        </div>
    );
};