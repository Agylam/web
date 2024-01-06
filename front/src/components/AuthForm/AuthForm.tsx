import React, { useCallback, useState } from "react";
import "./AuthForm.scss";
import Input from "../UI/Input";
import Button from "../UI/Button";
import { useNavigate } from "react-router-dom";
import { useJwtContext } from "../../jwt-context";
import { PagePath } from "../../constants";
import { FullLogo } from "../UI/FullLogo/FullLogo";
import { AuthDataDto } from "../../interfaces/AuthData.dto";
import { auth } from "../../api/auth";


export const AuthForm = () => {
    const [authData, setAuthData] = useState<AuthDataDto>({
        email: "",
        password: ""
    });

    const navigate = useNavigate();
    const { setAccessToken } = useJwtContext();

    const onAuthSubmit = useCallback(
        async (e: React.FormEvent) => {
            e.preventDefault();
            try {
                const response = await auth(authData.email, authData.password);
                console.log(response);
                setAccessToken(response.accessToken);
                console.log("SET JWT", response.accessToken);
                navigate(PagePath.schedule);
            } catch (e) {
                console.log(e);
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