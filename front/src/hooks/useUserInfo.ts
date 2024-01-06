import { decodeToken } from "react-jwt";
import { useJwtContext } from "../jwt-context";
import { DecodedToken, User } from "../interfaces/DecodedToken";

export const useUserInfo = (): User | null => {
    const { accessToken } = useJwtContext();

    const decodedToken = decodeToken<DecodedToken>(accessToken);


    if (!decodedToken)
        return null;
    if (typeof decodedToken.email !== "string")
        return null;
    if (typeof decodedToken.fullname !== "string")
        return null;
    if (!Array.isArray(decodedToken.roles))
        return null;
    if (decodedToken.school.uuid === undefined)
        return null;

    return {
        ...decodedToken,
        rolesName: decodedToken.roles.map(role => role.name)
    };
};
