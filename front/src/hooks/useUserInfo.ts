import { decodeToken } from "react-jwt";
import IUser from "../interfaces/IUser";
import { useJwtContext } from "../context/jwt-context";
import { IDecodedToken } from "../interfaces/IDecodedToken";

export const useUserInfo = (): IUser | null => {
    const { jwts } = useJwtContext();
    const decodedToken = decodeToken<IDecodedToken>(jwts.accessToken);
    if (!decodedToken)
        return null;
    if (typeof decodedToken.email !== "string")
        return null;
    if (typeof decodedToken.fullname !== "string")
        return null;
    return decodedToken;
};
