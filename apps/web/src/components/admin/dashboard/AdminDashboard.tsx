"use client";

import { Box, SxProps, Typography } from "@mui/material";
import { useState } from "react";
import { AdminView } from "../types";

import LogoutButton from "./LogoutButton";

import { AdminSession } from "@/hooks/server/admin/types";
import { useAdminLogout } from "@/hooks/server/admin/useAdminLogout";

import AdminHomeView from "./AdminHomeView";
import AdminProjectsView from "./views/projects/view";

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
        return <Typography>Artists admin view</Typography>;
      case "hardware":
        return <Typography>Hardware admin view</Typography>;
      default:
        return <AdminHomeView onSelectView={setActiveView} />;
    }
  }

  return (
    <Box sx={containerSx}>
      <Box sx={userInfosSx}>
        <Typography variant="h4">
          Connecté en tant que : <strong>{admin.email}</strong>
        </Typography>

        <LogoutButton onClick={handleLogout} disabled={isLoggingOut} />
      </Box>

      <Box>{renderView()}</Box>
    </Box>
  );
}

const containerSx: SxProps = {
  width: "100%",
};

const userInfosSx: SxProps = {
  width: "100%",
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  mb: 4,
};
