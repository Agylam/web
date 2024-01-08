import React, { useEffect } from "react";

import "./IndexPage.scss";
import { AuthForm } from "../../components/AuthForm/AuthForm";
import { useUserInfo } from "../../hooks/useUserInfo";
import { useNavigate } from "react-router-dom";
import { PagePath } from "../../constants";

export default function IndexPage() {
    const user = useUserInfo();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate(PagePath.schedule, { replace: true });
        }
    }, [user, navigate, PagePath.schedule]);

    return (
        <AuthForm />
    );
}
