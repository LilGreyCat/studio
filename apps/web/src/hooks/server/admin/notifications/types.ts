export type { Notification } from "../../notifications";

export type NotificationPayload = {
  message: string;
  target_url: string;
  starts_at: string;
  ends_at: string;
};
