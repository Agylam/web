import Lesson from "../interfaces/Lesson";

export default async function setDayFetch(
    class_range: string,
    dayOfWeek: number,
    lessons: Lesson[] | null,
    jwt: string
) {
    const response = await fetch(`/api/schedule/${class_range}/${dayOfWeek}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt}`
        },
        body: JSON.stringify(lessons),
        redirect: "follow"
    });

    if (!response.ok) {
        // eslint:recommended
        // no-useless-catch prohibits to use try/catch for catching possible fetch error
        throw new Error(`Error: Request ended with status: ${response.status}`);
    }

    return response.json();
}
