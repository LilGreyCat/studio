import { fetchJson } from "@/utils/fetchJson";

import type { HardwareItem } from "./types";

export function getHardware(): Promise<HardwareItem[]> {
    return fetchJson<HardwareItem[]>("/hardware");
}
