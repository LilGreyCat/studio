import { fetchJson } from "@/utils/fetchJson";
import type { Notification } from "./types";

export function getActiveNotification(): Promise<Notification | undefined> {
  return fetchJson<Notification | undefined>("/notifications/active");
}
