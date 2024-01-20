import React from "react";
import "./AuthorizedContainer.scss";
import { Navbar } from "../../components/Navbar/Navbar";

interface AuthorizedContainerProps {
    children: React.ReactNode;
}

export const AuthorizedContainer = (props: AuthorizedContainerProps) => {
    return (
        <>
            <Navbar />
            {props.children}
        </>
    );
};
