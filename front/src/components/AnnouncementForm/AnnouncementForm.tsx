import React, { useState } from "react";
import "./AnnouncementForm.css";

interface IAnnouncementFormProps {
    clickHandler: (text: string) => void;
}

export default function AnnouncementForm({ clickHandler }: IAnnouncementFormProps) {
    const [textAreaValue, setTextAreaValue] = useState("");

    const changeHandler = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setTextAreaValue(e.target.value);
    };
    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        clickHandler(textAreaValue);
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
                ></textarea>
                <button type="submit">Отправить</button>
            </form>
        </div>
    );
}

