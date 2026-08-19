import { GlassySurface, MainLogo } from "@/components/ui";
import { Box, Link, Stack, Typography } from "@mui/material";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Mentions légales",
  description: "Mentions légales du site Nhadès Records.",
};

const missingInformation = "À compléter avant la mise en ligne";

export default function LegalNotices() {
  return (
    <Box sx={{ width: "100%", pb: 5 }}>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <MainLogo marginBottom={4} />
      </Box>

      <Stack spacing={3} sx={{ width: "100%", maxWidth: 900, mx: "auto" }}>
        <Box sx={{ px: { xs: 1, sm: 2 } }}>
          <Typography
            component="h1"
            sx={{
              fontSize: { xs: "2rem", sm: "2.75rem" },
              fontWeight: 700,
            }}
          >
            Mentions légales
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 1 }}>
            Informations relatives à l’édition et à l’exploitation du site
            nhadesrecords.fr.
          </Typography>
        </Box>

        <LegalSection title="Éditeur du site">
          <LegalLine label="Nom commercial" value="Nhadès Records" />
          <LegalLine label="Forme juridique" value={missingInformation} />
          <LegalLine label="Nom ou raison sociale" value={missingInformation} />
          <LegalLine label="Adresse" value={missingInformation} />
          <LegalLine label="SIREN / SIRET" value={missingInformation} />
          <LegalLine label="RCS / RNE" value={missingInformation} />
          <LegalLine label="TVA intracommunautaire" value="Le cas échéant" />
          <LegalLine label="Téléphone" value="06 50 46 24 88" />
          <Typography color="text.secondary">
            Contact électronique : via le{" "}
            <Link href="/contact" color="inherit">
              formulaire de contact
            </Link>
            .
          </Typography>
        </LegalSection>

        <LegalSection title="Direction de la publication">
          <Typography color="text.secondary">{missingInformation}</Typography>
        </LegalSection>

        <LegalSection title="Hébergement">
          <Typography color="text.secondary">
            Le nom, la raison sociale, l’adresse et le numéro de téléphone de
            l’hébergeur devront être renseignés lorsque l’hébergement de
            production aura été choisi.
          </Typography>
        </LegalSection>

        <LegalSection title="Propriété intellectuelle">
          <Typography color="text.secondary">
            Sauf mention contraire, les textes, photographies, éléments
            graphiques, logos et contenus présents sur ce site sont protégés.
            Toute reproduction, représentation, modification ou exploitation,
            totale ou partielle, nécessite l’autorisation préalable de leurs
            titulaires respectifs.
          </Typography>
        </LegalSection>

        <LegalSection title="Données personnelles">
          <Typography color="text.secondary">
            Les informations transmises par le formulaire de contact sont
            utilisées uniquement pour répondre aux demandes reçues. Pour toute
            question relative à vos données ou pour exercer vos droits,
            utilisez le{" "}
            <Link href="/contact" color="inherit">
              formulaire de contact
            </Link>
            . Les durées de conservation, destinataires et fondements
            juridiques devront être précisés avant la mise en production.
          </Typography>
        </LegalSection>

        <Typography
          color="text.secondary"
          sx={{ px: { xs: 1, sm: 2 }, fontSize: ".8rem" }}
        >
          Dernière mise à jour : 19 août 2026
        </Typography>
      </Stack>
    </Box>
  );
}

function LegalSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <GlassySurface
      sx={{
        p: { xs: 2.5, sm: 4 },
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
      }}
    >
      <Typography component="h2" variant="h5" sx={{ mb: 2 }}>
        {title}
      </Typography>
      <Stack spacing={1}>{children}</Stack>
    </GlassySurface>
  );
}

function LegalLine({ label, value }: { label: string; value: string }) {
  return (
    <Typography color="text.secondary">
      <Box component="span" sx={{ color: "text.primary", fontWeight: 600 }}>
        {label} :{" "}
      </Box>
      {value}
    </Typography>
  );
}
