import { fetchJson } from "@/utils/fetchJson";

import type { AdminSession } from "./types";

type LoginPayload = {
    email: string;
    password: string;
};

type LoginResponse = {
    message: string;
};

export function getAdminSession(): Promise<AdminSession> {
    return fetchJson<AdminSession>("/admin/me", {
        credentials: "include",
    });
}

export function loginAdmin(payload: LoginPayload): Promise<LoginResponse> {
    return fetchJson<LoginResponse>("/admin/login", {
        method: "POST",
        credentials: "include",
        body: JSON.stringify(payload),
    });
}

export function logoutAdmin(): Promise<{ message: string }> {
    return fetchJson<{ message: string }>("/admin/logout", {
        method: "POST",
        credentials: "include",
    });
}
