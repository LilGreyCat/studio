"use client";

import { Box, Typography } from "@mui/material";

import AdminLogin from "@/components/admin/adminLogin";
import AdminDashboard from "@/components/admin/dashboard/AdminDashboard";
import { useAdminSession } from "@/hooks/server/admin/useAdminSession";

export default function AdminPage() {
  const { admin, isAuthenticated, isLoading, refreshSession } =
    useAdminSession();

  if (isLoading) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography>Checking session...</Typography>
      </Box>
    );
  }

  if (!isAuthenticated || !admin) {
    return <AdminLogin onLoginSuccess={refreshSession} />;
  }

  return <AdminDashboard admin={admin} onLogoutSuccess={refreshSession} />;
}
