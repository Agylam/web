import { useEffect } from "react";
import { isExpired as checkIsExpired } from "react-jwt";
import { useJwtContext } from "../context/jwt-context";
import refreshFetch from "../fetches/refreshFetch";

const accessTokenCheckIntervalMs = 5000;

export const useJwtKeepAlive = () => {
  const { jwts, setJwts } = useJwtContext();

  useEffect(() => {
    const intervalId = setInterval(async () => {
      if (!jwts.accessToken || !checkIsExpired(jwts.accessToken)) {
        return;
      }

      const newJwt = await refreshFetch(jwts.refreshToken);
      setJwts(newJwt);
      // reEvaluateToken(newJwt && newJwt.accessToken);
    }, accessTokenCheckIntervalMs);

    return () => {
      clearInterval(intervalId);
    }
  }, [jwts, setJwts]);
};
