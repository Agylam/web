import { decodeToken } from "react-jwt";
import { useJwtStorage } from "./useJwtStorage";
import IUser from "../interfaces/IUser";

export const useUserInfo = (): IUser | null => {
    const { getJwt } = useJwtStorage();
    const jwt = getJwt();
    const decodedToken: any = decodeToken(jwt && jwt.accessToken);
    if (!decodedToken) {
        return null;
    }
    if (typeof decodedToken.email !== "string") {
        return null;
    }
    if (
        typeof decodedToken.fullname !== "object" &&
    typeof decodedToken.fullname !== "string"
    ) {
        return null;
    }
    return decodedToken;
};
