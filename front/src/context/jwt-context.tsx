import { createContext, useContext, useEffect, useState } from "react";
import { loadJwts, saveJwts } from "../utils/jwts";

export interface JWTs {
  accessToken: string;
  refreshToken: string;
}

type JwtContextType = {
  jwts: JWTs;
  setJwts: (jwts: JWTs) => void;
}

const defaultValue = {
  jwts: {
    accessToken: '',
    refreshToken: '',
  },
  setJwts: () => {},
};

const JwtContext = createContext<JwtContextType>(defaultValue);

export const useJwtContext = () => {
  const context = useContext(JwtContext);
  return context;
};

export const JwtProvider = (props: Record<any, any>) => {
  const [jwts, setJwts] = useState<JWTs>(defaultValue.jwts);
  useEffect(() => {
    try {
      const loadedJwts = loadJwts();
      loadedJwts && setJwts(loadedJwts);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => saveJwts(jwts), [jwts]);
  return <JwtContext.Provider value={{ jwts, setJwts }} {...props} />;
};
