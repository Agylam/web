import React, { createContext, useContext } from "react";
import useLocalStorage from "use-local-storage";

export interface JWTs {
    accessToken: string;
}

type JwtContextType = {
    jwts: JWTs;
    setJwts: (jwts: JWTs) => void;
};

const defaultValue: JwtContextType = {
    jwts: {
        accessToken: ""
    },
    setJwts: (jwts: JWTs) => {
        return;
    }
};

const JwtContext = createContext<JwtContextType>(defaultValue);

export const useJwtContext = () => {
    const context = useContext(JwtContext);
    return context;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const JwtProvider = (props: Record<any, any>) => {
    const [jwts, setJwts] = useLocalStorage<JWTs>("jwt", defaultValue.jwts);
    return <JwtContext.Provider value={{ jwts, setJwts }} {...props} />;
};
