import ILesson from "../interfaces/ILesson";

export default async function dayFetch(order: number): Promise<ILesson[]> | never {
    const resp: Response = await fetch(
        `/api/schedule/${order}`,
        {
            method: "get",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
        },
    );

    if (resp.ok) {
        const respObj = await resp.json();

        return respObj;
    }
    throw resp;
}
