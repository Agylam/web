import React from "react";
import { useRouteError } from "react-router-dom";

export default function ErrorPage() {
    const error = useRouteError();
    console.error(error);

    return (
        <div id="error-page">
            <h1>Ой...</h1>
            <p>Извините, возникла неожиданная ошибка</p>
            <p>
                <i>Скоро мы всё починим</i>
            </p>
        </div>
    );
}