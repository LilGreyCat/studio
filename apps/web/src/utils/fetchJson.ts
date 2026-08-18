import { API_BASE_URL } from "./constants";

type FetchJsonOptions = RequestInit & {
    body?: BodyInit | null;
};

const inFlightGetRequests = new Map<string, Promise<unknown>>();

async function executeJsonRequest<T>(
    url: string,
    options: FetchJsonOptions,
    headers: Headers
): Promise<T> {
    const response = await fetch(url, {
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

export function fetchJson<T>(
    path: string,
    options: FetchJsonOptions = {}
): Promise<T> {
    const headers = new Headers(options.headers);

    if (
        options.body != null &&
        !(options.body instanceof FormData) &&
        !headers.has("Content-Type")
    ) {
        headers.set("Content-Type", "application/json");
    }

    const url = `${API_BASE_URL}${path}`;
    const method = (options.method ?? "GET").toUpperCase();
    const canDeduplicate =
        method === "GET" && options.body == null && options.signal == null;

    if (!canDeduplicate) {
        return executeJsonRequest<T>(url, options, headers);
    }

    const headerKey = [...headers.entries()]
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([name, value]) => `${name}:${value}`)
        .join("|");
    const requestKey = `${url}|${options.credentials ?? ""}|${headerKey}`;
    const existingRequest = inFlightGetRequests.get(requestKey);
    if (existingRequest) {
        return existingRequest as Promise<T>;
    }

    const request = executeJsonRequest<T>(url, options, headers).finally(() => {
        if (inFlightGetRequests.get(requestKey) === request) {
            inFlightGetRequests.delete(requestKey);
        }
    });
    inFlightGetRequests.set(requestKey, request);
    return request;
}
