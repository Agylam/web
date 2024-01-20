import { useEffect } from "react";
import { isExpired } from "react-jwt";
import { useAccessToken } from "./useAccessToken";
import { refreshToken } from "../api/refreshToken";

const accessTokenCheckIntervalMs = 3000;


export const useJwtKeepAlive = () => {
    const { accessToken, setAccessToken } = useAccessToken();

    useEffect(() => {
        let updateInterval = -1;
        const updateAccessToken = async () => {
            if (!accessToken || !isExpired(accessToken)) {
                return;
            }

            try {
                const { accessToken } = await refreshToken();
                setAccessToken(accessToken);
            } catch (e) {
                clearInterval(updateInterval);
                setAccessToken("");
                console.error("Ошибка обновления токена");
            }
        };

        if (accessToken && !isExpired(accessToken)) {
            updateInterval = setInterval(updateAccessToken, accessTokenCheckIntervalMs);
            return () => {
                clearInterval(updateInterval);
            };
        }
    }, [accessToken, setAccessToken]);
};
