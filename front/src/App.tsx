/**
 * @license Agylam
 * App.tsx
 * Facebook, продукт компании Meta, которая признана экстремистской организацией в России
 */

import React, { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { useJwt, isExpired as checkIsExpired } from "react-jwt";
import { useJwtStorage } from "./hooks/useJwtStorage";
import { AppRoutes } from "./routes/AppRoutes";
import refreshFetch from "./fetches/refreshFetch";

import "./css/color-light.css";
import "./css/main.css";

const accessTokenCheckIntervalMs = 5000;

export default function App() {
    const { getJwt, setJwt } = useJwtStorage();
    const jwt = getJwt();
    const { isExpired, reEvaluateToken } = useJwt(jwt && jwt.accessToken);
    const validToken = !isExpired;

    useEffect(() => {
        const intervalId = setInterval(async () => {
            if (!checkIsExpired(jwt && jwt.accessToken)) {
                return;
            }
            const newJwt = await refreshFetch(jwt.refreshToken);
            setJwt(newJwt);
            reEvaluateToken(newJwt && newJwt.accessToken);
        }, accessTokenCheckIntervalMs);

        return () => {
            clearInterval(intervalId);
        }
    }, [jwt, setJwt]);

    return (
        <BrowserRouter>
            <React.StrictMode>
                <AppRoutes hasProtectedAccess={validToken} />
            </React.StrictMode>
        </BrowserRouter>
    );
}
