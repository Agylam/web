import { useEffect } from "react";
import { isExpired as checkIsExpired } from "react-jwt";
import { useJwtContext } from "../context/jwt-context";
import refreshFetch from "../fetches/refreshFetch";

const accessTokenCheckIntervalMs = 5000;

export const useJwtKeepAlive = () => {
    const { accessToken, setAccessToken } = useJwtContext();

    useEffect(() => {
        const intervalId = setInterval(async () => {
            if (!accessToken || !checkIsExpired(accessToken)) {
                return;
            }

            try {
                const newJwt = await refreshFetch();
                setAccessToken(newJwt);
            } catch (e) {
                clearInterval(intervalId);
                setAccessToken("");
                console.error("Ошибка обновления токена");
            }
            // reEvaluateToken(newJwt && newJwt.accessToken);
        }, accessTokenCheckIntervalMs);

        return () => {
            clearInterval(intervalId);
        };
    }, [accessToken, setAccessToken]);
};
