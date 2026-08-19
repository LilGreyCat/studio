"use client";

import { useCallback, useEffect, useState } from "react";
import { getAdminNotifications } from "./api";
import type { Notification } from "./types";

export function useAdminNotifications() {
  const [items, setItems] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const refresh = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      setItems(await getAdminNotifications());
    } catch (error) {
      setError(error instanceof Error ? error.message : "Impossible de charger les notifications");
    } finally {
      setIsLoading(false);
    }
  }, []);
  useEffect(() => { void refresh(); }, [refresh]);
  return { items, isLoading, error, refresh };
}
