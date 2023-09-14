import { JWTs } from "../context/jwt-context";

export default async function authFetch(email: string, password: string): Promise<JWTs> | never {
    const resp: Response = await fetch("/api/auth/login", {
        method: "post",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email: email,
            password: password,
        }),
    });

    if (resp.ok) {
        const respObj = await resp.json();
        if (typeof respObj.accessToken !== "string" && typeof respObj.refreshToken !== "string") {
            throw new Error("Invalid response in auth request");
        }

        return respObj;
    }

    throw resp;
}
