import React, { useCallback } from "react";

import NavbarComponent from "../сomponents/Navbar/Navbar";
import AnnouncementForm from "../сomponents/AnnouncementForm/AnnouncementForm";
import announcementFetch from "../fetches/announcementFetch";

import { ToastContainer, toast } from "react-toastify";
import { useUserInfo } from "../hooks/useUserInfo";

export default function AnnouncementPage() {
    const userInfo = useUserInfo();

    const sendAnnouncement = useCallback((text: string) => {
        try {
            if (!text) throw new Error();
            announcementFetch(text, localStorage.getItem("jwt") as string).then(() => {
                toast.success("Успешно!", {
                    position: toast.POSITION.BOTTOM_LEFT,
                    autoClose: 1000,
                });
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

