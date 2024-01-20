import React, { useState } from "react";
import "./AuthForm.scss";
import Input from "../UI/Input";
import Button from "../UI/Button";
import { useNavigate } from "react-router-dom";
import { useAccessToken } from "../../hooks/useAccessToken";
import { FullLogo } from "../UI/FullLogo/FullLogo";
import { AuthDataDto } from "../../interfaces/AuthData.dto";
import { auth } from "../../api/auth";
import { PagePath } from "../../constants";

export const AuthForm = () => {
    const [authData, setAuthData] = useState<AuthDataDto>({
        email: "",
        password: "",
    });

    const navigate = useNavigate();
    const { accessToken, setAccessToken } = useAccessToken();

    const onAuthSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await auth(authData.email, authData.password);
            localStorage.accessToken = JSON.stringify(response.accessToken);
            // setTimeout(() => {
            navigate(PagePath.schedule);
            //     console.log("TM", localStorage.accessToken);
            // }, 1000);
        } catch (e) {
            console.error("AuthFrom error:", e);
        }
    };

    const onChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAuthData((prev) => {
            return {
                ...prev,
                email: e.target.value,
            };
        });
    };

    const onChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAuthData((prev) => {
            return {
                ...prev,
                password: e.target.value,
            };
        });
    };

    return (
        <div className="auth_block">
            <form id="auth" onSubmit={onAuthSubmit}>
                <FullLogo />
                <div className="auth_inputs">
                    <Input
                        type="email"
                        required={true}
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
                    <Button type="submit">Войти</Button>
                </div>
                <p className="conditions">
                    Нажимая кнопку «Войти», вы соглашаетесь с<a href="/rules"> правилами использования </a>
                    сайтом
                </p>
            </form>
        </div>
    );
};
