import { API_BASE_URL } from "./constants";

type FetchJsonOptions = RequestInit & {
    body?: BodyInit | null;
};

export async function fetchJson<T>(
    path: string,
    options: FetchJsonOptions = {}
): Promise<T> {
    const headers = new Headers(options.headers);

    if (!(options.body instanceof FormData) && !headers.has("Content-Type")) {
        headers.set("Content-Type", "application/json");
    }

    const response = await fetch(`${API_BASE_URL}${path}`, {
        cache: "no-store",
        ...options,
        headers,
    });

    if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
    }

    if (response.status === 204) {
        return undefined as T;
    }

    return response.json() as Promise<T>;
}
