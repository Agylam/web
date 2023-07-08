export default async function announcementFetch(announcement: string, jwt: string): Promise<string> | never {
    const resp: Response = await fetch(import.meta.env.VITE_API_URL + "notification", {
        method: "post",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({
            announcement,
            time: new Date(),
        }),
    });
    //fixme обычно пишут response, либо сокращают до res
    if (resp.ok) {
        const respObj = await resp.json();

        return respObj.token as string;
    }

    throw resp;
}

