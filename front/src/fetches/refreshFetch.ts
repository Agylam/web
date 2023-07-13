import { JWT } from "../hooks/useJwtStorage";

export default async function refreshFetch(refresh_token: string): Promise<JWT> | never {
    const resp: Response = await fetch(`/api/user/refresh_token/${refresh_token}`, {
        // почему обновление токена идёт через GET?
        // GET должен быть идемпотентным по стандарту
        // и все браузеры относятся к нему как к илемпотентному
        // к чему это может привести?
        // браузер может кэшировать этот запрос и сам его переодически дёргать для обновления кэша
        method: "GET",
    });

    if (resp.ok) {
        const respObj = await resp.json();
        if (
            typeof respObj.accessToken !== "string" &&
          typeof respObj.refreshToken !== "string"
        ) {
            throw new Error("Invalid response in auth request");
        }

        return respObj;
    }

    throw resp;
}
