import { fetcher, HttpMethod } from "../utils/fetcher";

interface AuthResponse {
    error?: string;
    message?: string;
    accessToken: string;
}

export const auth = async (email: string, password: string) => {
    const authResponse = await fetcher<AuthResponse>(
        ["/auth/login"], { email, password }, HttpMethod.POST
    );
    if (!authResponse)
        throw new Error("Ошибка: Пустой ответ от /auth/login. Сообщение от API:" + (authResponse || ""));
    return authResponse;
};