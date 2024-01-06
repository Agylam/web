import { toast } from "react-toastify";

export enum HttpMethod {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    DELETE = "DELETE"
}

export const fetcher = async <T = unknown>([uri, token = ""]: string[], data = {}, method: HttpMethod = HttpMethod.GET): Promise<T> => {
    const unparsed_response = await fetch("/api" + uri, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        method,
        body: method !== HttpMethod.GET ? JSON.stringify(data) : null
    });

    let resp: T & { message?: string };

    try {
        resp = await unparsed_response.json();
    } catch (e) {
        console.error();
        throw new Error(unparsed_response.statusText);
    }

    if (!unparsed_response.ok) {
        if (resp.message !== undefined) {
            toast.error(resp.message);
            throw new Error(resp.message);
        }
        console.error("Произошла ошибка при получении данных. URI: " + uri);
        throw new Error(unparsed_response.statusText);
    }


    return resp;
};
