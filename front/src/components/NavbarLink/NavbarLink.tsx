import "./NavbarLink.scss";
import { Link } from "react-router-dom";
import React from "react";

interface INavbarElementProps {
    name: string;
    uri: string;
}

export const NavbarLink = (props: INavbarElementProps) => {

    return (
        <Link to={props.uri}>
            <li className={"nav_item " + (window.location.pathname === props.uri ? "active" : "")}>{props.name}</li>
        </Link>
    );
};