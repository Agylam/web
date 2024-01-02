import React from "react";

import "./IndexPage.scss";
import { AuthForm } from "../../components/AuthForm/AuthForm";

export default function IndexPage() {


    //fixme выглядит так, что это можно разделить на компоненты сильнее
    return (
        <div className="index_container">
            <AuthForm />
        </div>
    );
}
