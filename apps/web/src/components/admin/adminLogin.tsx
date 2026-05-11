"use client";

import {
  Box,
  Button,
  SxProps,
  TextField,
  Theme,
  Typography,
} from "@mui/material";

import { useAdminLogin } from "@/hooks/server/admin/useAdminLogin";

import { GlassySurface } from "../ui";

type AdminLoginProps = {
  onLoginSuccess?: () => Promise<void> | void;
};

export default function AdminLogin({ onLoginSuccess }: AdminLoginProps) {
  const {
    email,
    password,
    isLoggingIn,
    loginError,
    setEmail,
    setPassword,
    handleSubmit,
  } = useAdminLogin({ onLoginSuccess });

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <GlassySurface>
        <Typography variant="h4" sx={titleSx} gutterBottom>
          Login Administrateur
        </Typography>

        <TextField
          label="Email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          fullWidth
          sx={{ ...contentSx, mb: 3 }}
        />

        <TextField
          label="Mot de passe"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          fullWidth
          sx={{ ...contentSx, mb: 3 }}
        />

        {loginError && (
          <Typography color="error" sx={{ mb: 2 }}>
            {loginError}
          </Typography>
        )}

        <Button type="submit" disabled={isLoggingIn} variant="contained">
          {isLoggingIn ? "Connexion..." : "Se connecter"}
        </Button>
      </GlassySurface>
    </Box>
  );
}

const contentSx: SxProps<Theme> = {
  fontSize: { xs: "0.875rem", md: "1rem" },
};

const titleSx: SxProps<Theme> = {
  pl: "5px",
  mb: 2,
  fontWeight: 400,
  fontSize: { xs: "1.2rem", md: "1.5rem" },
};
