import { createContext, useContext } from "react";
import useLocalStorage from "use-local-storage";

export interface JWTs {
    accessToken: string;
    refreshToken: string;
}

type JwtContextType = {
    jwts: JWTs;
    setJwts: (jwts: JWTs) => void;
};

const defaultValue = {
    jwts: {
        accessToken: "",
        refreshToken: "",
    },
    setJwts: () => {},
};

const JwtContext = createContext<JwtContextType>(defaultValue);

export const useJwtContext = () => {
    const context = useContext(JwtContext);
    return context;
};

export const JwtProvider = (props: Record<any, any>) => {
    const [jwts, setJwts] = useLocalStorage<JWTs>("jwt", defaultValue.jwts);
    return <JwtContext.Provider value={{ jwts, setJwts }} {...props} />;
};
