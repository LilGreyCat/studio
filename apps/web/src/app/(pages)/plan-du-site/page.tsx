import { GlassySurface, MainLogo } from "@/components/ui";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Box, Link, Stack, Typography } from "@mui/material";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Plan du site",
  description: "Retrouvez toutes les pages du site Nhadès Records.",
};

const mainPages = [
  { label: "Accueil", href: "/", description: "Présentation du studio Nhadès Records." },
  { label: "Matériel", href: "/materiel", description: "Découvrez les équipements disponibles au studio." },
  { label: "Références", href: "/references", description: "Parcourez les projets et artistes accompagnés." },
  { label: "Shop", href: "/shop", description: "Accédez à l’espace boutique du studio." },
  { label: "Tarifs", href: "/tarifs", description: "Consultez les prestations et formules proposées." },
  { label: "Contact", href: "/contact", description: "Contactez le studio et préparez votre projet." },
] as const;

const informationPages = [
  { label: "Mentions légales", href: "/mentions-legales" },
  { label: "Conditions générales de vente", href: "/conditions-generales-de-vente" },
  { label: "Plan du site", href: "/plan-du-site" },
] as const;

export default function SitemapPage() {
  return (
    <Box sx={{ width: "100%", pb: 5 }}>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <MainLogo marginBottom={4} />
      </Box>

      <Stack spacing={4} sx={{ width: "100%", maxWidth: 900, mx: "auto" }}>
        <Box sx={{ px: { xs: 1, sm: 2 }, textAlign: "center" }}>
          <Typography
            component="h1"
            sx={{ fontSize: { xs: "2rem", sm: "2.75rem" }, fontWeight: 700 }}
          >
            Plan du site
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 1 }}>
            Retrouvez rapidement toutes les pages de Nhadès Records.
          </Typography>
        </Box>

        <SitemapSection title="Pages principales">
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))" },
              gap: 2,
            }}
          >
            {mainPages.map((page) => (
              <Link
                key={page.href}
                href={page.href}
                underline="none"
                color="inherit"
                sx={{
                  p: 2,
                  minHeight: 110,
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 1.5,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 2,
                  transition: "border-color 180ms ease, transform 180ms ease",
                  "&:hover, &:focus-visible": {
                    borderColor: "text.primary",
                    transform: "translateY(-2px)",
                  },
                }}
              >
                <Box>
                  <Typography component="h3" variant="h6" fontWeight={700}>
                    {page.label}
                  </Typography>
                  <Typography color="text.secondary" variant="body2" sx={{ mt: 0.5 }}>
                    {page.description}
                  </Typography>
                </Box>
                <ArrowForwardIcon aria-hidden="true" sx={{ flexShrink: 0 }} />
              </Link>
            ))}
          </Box>
        </SitemapSection>

        <SitemapSection title="Informations">
          <Stack spacing={1.5}>
            {informationPages.map((page) => (
              <Link
                key={page.href}
                href={page.href}
                underline="hover"
                color="text.secondary"
                sx={{ width: "fit-content", fontSize: "1rem" }}
              >
                {page.label}
              </Link>
            ))}
          </Stack>
        </SitemapSection>
      </Stack>
    </Box>
  );
}

function SitemapSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <GlassySurface
      sx={{
        p: { xs: 2.5, sm: 4 },
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
      }}
    >
      <Typography component="h2" variant="h5" sx={{ mb: 2.5 }}>
        {title}
      </Typography>
      {children}
    </GlassySurface>
  );
}
