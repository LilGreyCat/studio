import { fetchJson } from "@/utils/fetchJson";
import type { Notification, NotificationPayload } from "./types";

export function getAdminNotifications(): Promise<Notification[]> {
  return fetchJson<Notification[]>("/admin/notifications", { credentials: "include" });
}

export function createNotification(payload: NotificationPayload): Promise<Notification> {
  return fetchJson<Notification>("/admin/notifications", {
    method: "POST", credentials: "include", body: JSON.stringify(payload),
  });
}

export function updateNotification(id: number, payload: NotificationPayload): Promise<Notification> {
  return fetchJson<Notification>(`/admin/notifications/${id}`, {
    method: "PUT", credentials: "include", body: JSON.stringify(payload),
  });
}

export function deleteNotification(id: number): Promise<void> {
  return fetchJson<void>(`/admin/notifications/${id}`, {
    method: "DELETE", credentials: "include",
  });
}
