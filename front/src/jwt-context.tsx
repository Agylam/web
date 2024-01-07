import React, { createContext, ProviderProps, useContext } from "react";
import useLocalStorage from "use-local-storage";


type JwtContextType = {
    accessToken: string;
    setAccessToken: (accessToken: string) => void;
};

const defaultValue: JwtContextType = {
    accessToken: "",
    setAccessToken: (accessToken) => {
        localStorage.setItem("accessToken", accessToken);
    }
};

const JwtContext = createContext<JwtContextType>(defaultValue);

export const useJwtContext = () => useContext(JwtContext);

export const JwtProvider = (props: ProviderProps<JwtContextType>) => {
    const [accessToken, setAccessToken] = useLocalStorage("accessToken", defaultValue.accessToken);
    return <JwtContext.Provider {...props} value={{ accessToken, setAccessToken }} />;
};
