import React from "react";
import "./FullLogo.scss";
import logoImg from "../../../assets/logo.svg";

export const FullLogo = () => {
    return (
        <img src={logoImg} alt="Логотип" className="fullLogo" />
    );
};