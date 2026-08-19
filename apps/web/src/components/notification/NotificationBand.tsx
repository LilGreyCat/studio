"use client";

import CloseIcon from "@mui/icons-material/Close";
import { Box, ButtonBase, IconButton, Typography } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";

import { NAVBAR_HEIGHT } from "@/components/ui/constants";
import { getActiveNotification, type Notification } from "@/hooks/server/notifications";

const BAND_HEIGHT = 44;

export default function NotificationBand() {
  const [notification, setNotification] = useState<Notification | null>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const viewportRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const dismissedIdRef = useRef<number | null>(null);

  const refresh = useCallback(async () => {
    try {
      const active = await getActiveNotification();
      setNotification(
        active && dismissedIdRef.current !== active.id ? active : null
      );
    } catch {
      setNotification(null);
    }
  }, []);

  useEffect(() => {
    const initial = window.setTimeout(() => void refresh(), 0);
    const interval = window.setInterval(() => void refresh(), 30_000);
    return () => {
      window.clearTimeout(initial);
      window.clearInterval(interval);
    };
  }, [refresh]);

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--notification-band-height",
      notification ? `${BAND_HEIGHT}px` : "0px"
    );
    return () => {
      document.documentElement.style.setProperty("--notification-band-height", "0px");
    };
  }, [notification]);

  useEffect(() => {
    const measure = () => {
      const viewport = viewportRef.current;
      const text = textRef.current;
      if (!viewport || !text) return;
      setIsOverflowing(text.scrollWidth > viewport.clientWidth);
    };
    measure();
    const observer = new ResizeObserver(measure);
    if (viewportRef.current) observer.observe(viewportRef.current);
    if (textRef.current) observer.observe(textRef.current);
    return () => observer.disconnect();
  }, [notification]);

  if (!notification) return null;

  function dismiss(): void {
    dismissedIdRef.current = notification!.id;
    setNotification(null);
  }

  return (
    <Box
      role="region"
      aria-label="Notification"
      sx={{
        position: "fixed",
        top: `${NAVBAR_HEIGHT}px`,
        left: 0,
        right: 0,
        zIndex: (theme) => theme.zIndex.appBar,
        height: `${BAND_HEIGHT}px`,
        display: "flex",
        bgcolor: "common.white",
        color: "common.black",
        boxShadow: "0 5px 18px rgba(0, 0, 0, .3)",
      }}
    >
      <ButtonBase
        component="a"
        href={notification.target_url}
        target="_blank"
        rel="noopener noreferrer"
        sx={{ flex: 1, minWidth: 0, px: 2, color: "inherit" }}
      >
        <Box ref={viewportRef} sx={{ width: "100%", overflow: "hidden" }}>
          <Box
            sx={{
              display: "flex",
              gap: isOverflowing ? "48px" : 0,
              width: "max-content",
              maxWidth: isOverflowing ? "none" : "100%",
              mx: isOverflowing ? 0 : "auto",
              animation: isOverflowing
                ? "notificationScroll 24s linear infinite"
                : "none",
              "@keyframes notificationScroll": {
                from: { transform: "translateX(0)" },
                to: { transform: "translateX(calc(-50% - 24px))" },
              },
              "@media (prefers-reduced-motion: reduce)": { animation: "none" },
            }}
          >
            <Typography
              ref={textRef}
              component="span"
              sx={{ whiteSpace: "nowrap", fontWeight: 700 }}
            >
              {notification.message}
            </Typography>
            {isOverflowing && (
              <Typography
                component="span"
                aria-hidden="true"
                sx={{ whiteSpace: "nowrap", fontWeight: 700 }}
              >
                {notification.message}
              </Typography>
            )}
          </Box>
        </Box>
      </ButtonBase>

      <IconButton
        aria-label="Fermer la notification"
        onClick={dismiss}
        sx={{ width: BAND_HEIGHT, height: BAND_HEIGHT, color: "common.black", borderRadius: 0 }}
      >
        <CloseIcon />
      </IconButton>
    </Box>
  );
}
