import { decodeToken } from "react-jwt";
import IUser from "../interfaces/IUser";
import { useJwtContext } from "../context/jwt-context";

export const useUserInfo = (): IUser | null => {
	const { jwts } = useJwtContext();
	const decodedToken: any = decodeToken(jwts.accessToken);
	if (!decodedToken) {
		return null;
	}
	if (typeof decodedToken.email !== "string") {
		return null;
	}
	if (
		typeof decodedToken.fullname !== "string"
	) {
		return null;
	}
	return decodedToken;
};
