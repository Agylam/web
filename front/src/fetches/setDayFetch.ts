import ILesson from "../interfaces/ILesson";

export default async function setDayFetch(
    order: number,
    lessons: ILesson[] | null,
    jwt: string
): Promise<string> | never {
    const response = await fetch(
        `/api/schedule/${order}`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwt}`,
            },
            body: JSON.stringify(lessons),
            redirect: "follow",
        }
    );


    if (!response.ok) {
    // eslint:recommended
    // no-useless-catch prohibits to use try/catch for catching possible fetch error
        throw new Error(`Error: Request ended with status: ${response.status}`);
    }

    const result = await response.json();
    return result;
}
