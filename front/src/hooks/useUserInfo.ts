import { decodeToken } from "react-jwt";
import { useAccessToken } from "./useAccessToken";
import { DecodedToken, User } from "../interfaces/DecodedToken";
import { useMemo } from "react";

export const useUserInfo = (): User | null => {
    const { accessToken, setAccessToken } = useAccessToken();

    const decodedToken = useMemo(() => {
        try {
            if (!accessToken)
                return null;
            return decodeToken<DecodedToken>(accessToken);
        } catch (e) {
            console.error("Ошибка декода токена:", e);
            return null;
        }
    }, [decodeToken, accessToken]);


    if (!decodedToken)
        return null;
    if (typeof decodedToken.email !== "string")
        throw new Error("Отсутствует email в JWT токене");
    if (typeof decodedToken.fullname !== "string")
        throw new Error("Отсутствует ФИО в JWT токене");
    if (!Array.isArray(decodedToken.roles))
        throw new Error("Отсутствуют роли в JWT токене");
    if (decodedToken.school.uuid === undefined)
        throw new Error("Отсутствует UUID школы в JWT токене");

    return {
        ...decodedToken,
        rolesName: decodedToken.roles.map(role => role.name)
    };
};
