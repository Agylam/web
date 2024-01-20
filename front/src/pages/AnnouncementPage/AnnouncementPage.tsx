import React, { useState } from "react";
import { toast } from "react-toastify";
import { pushAnnouncement } from "../../api/pushAnnouncement";
import "./AnnouncementPage.scss";

export const AnnouncementPage = () => {
    const [textAreaValue, setTextAreaValue] = useState("");
    const changeHandler = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setTextAreaValue(e.target.value);
    };
    const submit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const announcement = await pushAnnouncement(textAreaValue);
            if (!announcement) {
                toast.error("Неизвестная ошибка1");
                return;
            }
            // const anTime = announcement.time;
            // toast.success(`Успешно создано объявление в ${anTime.hours}:${anTime.minutes}`);
            toast.success("Успешно создано объявление");
        } catch (e) {
            console.error("AnnouncementPage", e);
            toast.error("Неизвестная ошибка");
        }
    };

    return (
        <div className="announcement_wrapper">
            <form className="announcement_form" onSubmit={submit}>
                <textarea
                    onChange={changeHandler}
                    name="message"
                    id="message"
                    placeholder="Введите текст"
                    value={textAreaValue}
                    maxLength={2000}
                    required={true}
                ></textarea>
                <button type="submit">Отправить</button>
            </form>
        </div>
    );
};

