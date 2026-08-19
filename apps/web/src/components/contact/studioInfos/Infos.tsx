import { Box, Typography } from "@mui/material";

export default function Infos() {
  return (
    <Box sx={boxSx}>
      <Typography variant="body1" sx={contentSx} gutterBottom>
        <strong>Studio Nha Dès Records</strong>
      </Typography>

      <Typography variant="body1" sx={contentSx} gutterBottom>
        contact@nhadesrecords.fr
      </Typography>

      <Typography variant="body1" sx={contentSx} gutterBottom>
        06.50.46.24.88
      </Typography>

      <Typography variant="body1" sx={contentSx} gutterBottom>
        47 Rue des Canadiens
        <br />
        76420 - Bihorel
      </Typography>
    </Box>
  );
}

const boxSx = {
  color: "text.secondary",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  alignItems: "flex-start",
};

const contentSx = {
  fontSize: { xs: "0.875rem", md: "1rem" },
};
