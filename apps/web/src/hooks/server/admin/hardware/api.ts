import { fetchJson } from "@/utils/fetchJson";

import type {
    CreateHardwarePayload,
    HardwareItem,
    UpdateHardwarePayload,
} from "./types";

export function getAdminHardware(): Promise<HardwareItem[]> {
    return fetchJson<HardwareItem[]>("/admin/hardware", {
        credentials: "include",
    });
}

export function createHardware(
    payload: CreateHardwarePayload
): Promise<HardwareItem> {
    return fetchJson<HardwareItem>("/admin/hardware", {
        method: "POST",
        credentials: "include",
        body: JSON.stringify(payload),
    });
}

export function updateHardware(
    id: number,
    payload: UpdateHardwarePayload
): Promise<HardwareItem> {
    return fetchJson<HardwareItem>(`/admin/hardware/${id}`, {
        method: "PATCH",
        credentials: "include",
        body: JSON.stringify(payload),
    });
}

export function deleteHardware(id: number): Promise<void> {
    return fetchJson<void>(`/admin/hardware/${id}`, {
        method: "DELETE",
        credentials: "include",
    });
}

export function reorderHardware(ids: number[]): Promise<HardwareItem[]> {
    return fetchJson<HardwareItem[]>("/admin/hardware/order", {
        method: "PUT",
        credentials: "include",
        body: JSON.stringify({ ids }),
    });
}
