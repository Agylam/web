export default async function refreshFetch(): Promise<string> | never {
    const resp: Response = await fetch("/api/auth/refresh/", {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        }
    });

    if (resp.ok) {
        const respObj = await resp.json();
        if (typeof respObj.accessToken !== "string" && typeof respObj.refreshToken !== "string") {
            throw new Error("Invalid response in auth request");
        }

        return respObj.accessToken;
    }

    throw resp;
}
