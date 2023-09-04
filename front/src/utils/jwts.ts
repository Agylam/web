import { JWTs } from "../context/jwt-context";

const localStorageKey = "jwt";

const parseJwt = (rawJwt: string): JWTs => {
  const parsed = JSON.parse(rawJwt);
  if (
    typeof parsed.accessToken !== "string" ||
    typeof parsed.refreshToken !== "string"
  ) {
    throw new Error("Cannot parse JWTs. Invalid format.");
  }
  return parsed;
};

export const loadJwts = () => {
  const rawJwt = localStorage.getItem(localStorageKey);

  return rawJwt && parseJwt(rawJwt);
};

export const saveJwts = (jwt: JWTs) =>
  localStorage.setItem(
    localStorageKey,
    JSON.stringify(jwt)
  );
