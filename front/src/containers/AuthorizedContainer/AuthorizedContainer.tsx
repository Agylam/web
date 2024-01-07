import React from "react";
import "./AuthorizedContainer.scss";
import NavbarComponent from "../../components/Navbar/Navbar";

interface AuthorizedContainerProps {
    children: React.ReactNode;
}

export const AuthorizedContainer = (props: AuthorizedContainerProps) => {
    return (
        <>
            <NavbarComponent />
            {props.children}
        </>
    );
};