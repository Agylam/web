import useLocalStorage from "use-local-storage";
import { debugLog } from "../utils/debugLog";

export const useAccessToken = () => {
    const [accessToken, setAccessToken] = useLocalStorage<string>("accessToken", "");
    const newSetAT = (tkn: string) => {
        debugLog("Update token", tkn);
        setAccessToken(tkn);
        debugLog("Updated token", accessToken, localStorage.accessToken);
    };
    return {
        accessToken, setAccessToken: newSetAT
    };
};
