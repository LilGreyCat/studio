import { Box } from "@mui/material";
import { locationWrapperSx } from "./styles";

const address = "Nha Dès Records";

export default function StudioLocation() {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  const src =
    "https://www.google.com/maps/embed/v1/place" +
    `?key=${apiKey}` +
    `&q=${encodeURIComponent(address)}`;

  return (
    <Box sx={locationWrapperSx}>
      <iframe
        title="Studio location"
        src={src}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        loading="lazy"
        allowFullScreen
      />
    </Box>
  );
}
