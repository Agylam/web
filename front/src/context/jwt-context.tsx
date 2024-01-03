import React, { createContext, useContext } from "react";
import useLocalStorage from "use-local-storage";


type JwtContextType = {
    accessToken: string;
    setAccessToken: (accessToken: string) => void;
};

const defaultValue: JwtContextType = {
    accessToken: "",
    setAccessToken: (accessToken) => {
        console.log("setAccessTokenUs", accessToken);
        localStorage.setItem("accessToken", accessToken);
    }
};

const JwtContext = createContext<JwtContextType>(defaultValue);

export const useJwtContext = () => {
    const a = useContext(JwtContext);
    console.log("fg", a);
    return a;
};

export const JwtProvider = (props: Record<any, any>) => {
    const [accessToken, setAccessToken] = useLocalStorage("accessToken", defaultValue.accessToken);
    return <JwtContext.Provider value={{ accessToken, setAccessToken }} {...props} />;
};
