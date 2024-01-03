import { decodeToken } from "react-jwt";
import { useJwtContext } from "../context/jwt-context";
import { DecodedToken, User } from "../interfaces/DecodedToken";

export const useUserInfo = (): User | null => {
    const { accessToken } = useJwtContext();
    console.log("accessToken", accessToken);
    const decodedToken = decodeToken<DecodedToken>(accessToken);
    console.log("s", decodedToken);

    if (!decodedToken)
        return null;
    console.log(1);
    if (typeof decodedToken.email !== "string")
        return null;
    console.log(2);
    if (typeof decodedToken.fullname !== "string")
        return null;
    console.log(3);
    if (!Array.isArray(decodedToken.roles))
        return null;
    console.log(4);
    if (decodedToken.school.uuid === undefined)
        return null;
    console.log(5);

    const a = {
        ...decodedToken,
        rolesName: decodedToken.roles.map(role => role.name)
    };
    console.log("a", a);
    return a;
};
