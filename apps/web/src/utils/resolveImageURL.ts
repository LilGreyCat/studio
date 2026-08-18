import { API_BASE_URL } from "./constants";

export function resolveImageURL(path: string): string {
    return path.startsWith("/uploads/") ? `${API_BASE_URL}${path}` : path;
}
