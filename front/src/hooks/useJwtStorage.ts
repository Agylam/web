const localStorageKey = "jwt";

export interface JWT {
  accessToken: string;
  refreshToken: string;
}

export const useJwtStorage = () => {
    const parseJwt = (rawJwt: string) => {
        const parsed = JSON.parse(rawJwt);
        if (
            typeof parsed.accessToken !== "string" ||
      typeof parsed.refreshToken !== "string"
        ) {
            throw new Error("Cannot parse JWT. Invalid format.");
        }
        return parsed;
    };

    const getJwt = () => {
        const rawJwt = localStorage.getItem(localStorageKey);

        return rawJwt && parseJwt(rawJwt);
    };

    const setJwt = (jwt: JWT) => {
        localStorage.setItem(
            localStorageKey,
            JSON.stringify(jwt)
        );
    };

    return {
        getJwt,
        setJwt,
    };
};
