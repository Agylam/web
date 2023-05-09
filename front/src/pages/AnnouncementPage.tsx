import React from "react";
import IUser from "../interfaces/IUser";
import NavbarComponent from "../сomponents/Navbar/Navbar";
import AnnouncementForm from "../сomponents/AnnouncementForm/AnnouncementForm";

import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useJwt } from "react-jwt";
import announcementFetch from "../fetches/announcementFetch";

import { ToastContainer, toast } from "react-toastify";

export default function AnnouncementPage() {
    const { decodedToken, isExpired } = useJwt<IUser>(localStorage.getItem("jwt") as string);
    const navigate = useNavigate();
    const exit = () => {
        localStorage.removeItem("jwt");
        navigate("/");
    };

    if (isExpired) {
        exit();
    }

    const userInfo = decodedToken;

    const sendAnnouncement = useCallback(async (text: string) => {
        try {
            if (!text) {
                throw new Error();
            }
            await announcementFetch(text, localStorage.getItem("jwt") as string);
            toast.success("Успешно!", {
                position: toast.POSITION.BOTTOM_LEFT,
                autoClose: 1000,
            });
        } catch (e) {
            console.error("AnnouncementPage", e);
            toast.error("Неизвестная ошибка", {
                position: toast.POSITION.BOTTOM_LEFT,
                autoClose: 2000,
            });
        }
    }, []);
    return (
        <>
            <NavbarComponent userInfo={userInfo} />
            <ToastContainer limit={3} />
            <AnnouncementForm clickHandler={sendAnnouncement} />
        </>
    );
}

