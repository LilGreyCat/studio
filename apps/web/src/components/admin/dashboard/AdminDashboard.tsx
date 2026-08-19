"use client";

import { Box, SxProps, Typography } from "@mui/material";
import { useState } from "react";
import { AdminView } from "../types";

import LogoutButton from "./LogoutButton";

import { AdminSession } from "@/hooks/server/admin/types";
import { useAdminLogout } from "@/hooks/server/admin/useAdminLogout";

import { MainLogo } from "@/components/ui";
import AdminHomeView from "./AdminHomeView";
import AdminProjectsView from "./views/projects/view";
import AdminHardwareView from "./views/hardware/view";
import AdminArtistsView from "./views/artists/view";

type AdminDashboardProps = {
  admin: AdminSession;
  onLogoutSuccess?: () => Promise<void> | void;
};

export default function AdminDashboard({
  admin,
  onLogoutSuccess,
}: AdminDashboardProps) {
  const [activeView, setActiveView] = useState<AdminView>("home");
  const { handleLogout, isLoggingOut } = useAdminLogout({ onLogoutSuccess });

  function renderView() {
    switch (activeView) {
      case "projects":
        return <AdminProjectsView onBack={() => setActiveView("home")} />;
      case "artists":
        return <AdminArtistsView onBack={() => setActiveView("home")} />;
      case "hardware":
        return <AdminHardwareView onBack={() => setActiveView("home")} />;
      default:
        return <AdminHomeView onSelectView={setActiveView} />;
    }
  }

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={userInfosSx}>
        <Typography variant="h5">
          Connecté en tant que : <strong>{admin.email}</strong>
        </Typography>

        <LogoutButton onClick={handleLogout} disabled={isLoggingOut} />
      </Box>

      <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
        <MainLogo marginBottom={3} />
      </Box>

      <Box>{renderView()}</Box>
    </Box>
  );
}

const userInfosSx: SxProps = {
  width: "100%",
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  mb: 4,
};
