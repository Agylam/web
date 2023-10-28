import React, { useCallback } from "react";

import NavbarComponent from "../components/Navbar/Navbar";
import AnnouncementForm from "../components/AnnouncementForm/AnnouncementForm";
import announcementFetch from "../fetches/announcementFetch";

import { toast, ToastContainer } from "react-toastify";
import { useUserInfo } from "../hooks/useUserInfo";

export default function AnnouncementPage() {
	const userInfo = useUserInfo();

	//fixme у useCallback одно предназначение - твой child мемоизирован, но из-за того, что ссылка на функцию нестабильна - происходит ререндер, т.к. меняются пропсы.
	//fixme и для этого ты мемоизируешь колбек стабилизируя ссылку. В данной ситуации не вижу в нем смысла. Ну и выносить надо обязательно логику из компонентов
	const sendAnnouncement = useCallback((text: string) => {
		try {
			if (!text) throw new Error();
			announcementFetch(text, localStorage.getItem("jwt") as string).then(() => {
				toast.success("Успешно!", {
					position: toast.POSITION.BOTTOM_LEFT,
					autoClose: 1000
				});
			});
		} catch (e) {
			console.error("AnnouncementPage", e);
			toast.error("Неизвестная ошибка", {
				position: toast.POSITION.BOTTOM_LEFT,
				autoClose: 2000
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

