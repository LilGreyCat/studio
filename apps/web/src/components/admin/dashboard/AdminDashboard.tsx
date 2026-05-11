"use client";

import { Box, SxProps, Typography } from "@mui/material";
import LogoutButton from "./LogoutButton";

import { AdminSession } from "@/hooks/server/admin/types";
import { useAdminLogout } from "@/hooks/server/admin/useAdminLogout";

type AdminDashboardProps = {
  admin: AdminSession;
  onLogoutSuccess?: () => Promise<void> | void;
};

export default function AdminDashboard({
  admin,
  onLogoutSuccess,
}: AdminDashboardProps) {
  const { handleLogout, isLoggingOut } = useAdminLogout({ onLogoutSuccess });

  return (
    <Box sx={containerSx}>
      <Box sx={userInfosSx}>
        <Typography variant="h4">
          Connecté en tant que : <strong>{admin.email}</strong>
        </Typography>
        <LogoutButton onClick={handleLogout} disabled={isLoggingOut} />
      </Box>
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
