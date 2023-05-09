export default async function authFetch(email: string, password: string): Promise<string> | never {
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

        return respObj.token as string;
    }

    throw resp;
}