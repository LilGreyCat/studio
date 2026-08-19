import { GlassySurface, MainLogo } from "@/components/ui";
import { Box, Stack, Typography } from "@mui/material";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Mentions légales",
  description: "Mentions légales du site Nhadès Records.",
};

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
          <LegalLine label="Nom commercial" value="Nha Dès Records" />
          <LegalLine label="Forme juridique" value="Entrepreneur individuel" />
          <LegalLine label="Nom ou raison sociale" value="ROUSSELIN NICOLAS" />
          <LegalLine
            label="Adresse"
            value="47 Rue des Canadiens 76420 - Bihorel"
          />
          <LegalLine
            label="SIREN / SIRET"
            value="SIREN 999943012 / SIRET 99994301200016"
          />
          <LegalLine
            label="Immatriculation"
            value="RCS Rouen 999 943 012 / RNE 999 943 012"
          />
          <LegalLine label="Téléphone" value="06 50 46 24 88" />
          <LegalLine
            label="Contact par email"
            value="contact@nhadesrecords.fr"
          />
        </LegalSection>

        <LegalSection title="Direction de la publication">
          <Typography color="text.secondary">
            Nicolas Rousselin, entrepreneur individuel exploitant Nha Dès
            Records.
          </Typography>
        </LegalSection>

        <LegalSection title="Hébergement">
          <Typography color="text.secondary">
            Le site nhadesrecords.fr est hébergé par :
            <br />
            <br />
            <strong>Hébergeur :</strong> OVH SAS (OVHcloud)
            <br />
            <strong>Adresse :</strong> 2 rue Kellermann, 59100 Roubaix, France
            <br />
            <strong>RCS :</strong> Lille Métropole 424 761 419
            <br />
            <strong>Téléphone :</strong> 1007 (France) / +33 9 72 10 10 07
            <br />
            <strong>Nom de domaine :</strong> nhadesrecords.fr, enregistré
            auprès d'IONOS.
          </Typography>
        </LegalSection>

        <LegalSection title="Propriété intellectuelle">
          <Typography color="text.secondary">
            Les éléments propres au site nhadesrecords.fr, notamment les textes,
            éléments graphiques, identité visuelle et contenus créés pour Nha
            Dès Records, sont protégés par les dispositions applicables en
            matière de propriété intellectuelle.
            <br />
            <br />
            Les photographies, pochettes, logos, noms d’artistes, contenus
            audiovisuels et autres éléments appartenant à des tiers restent la
            propriété de leurs auteurs ou titulaires de droits respectifs et
            sont utilisés sur ce site avec leur autorisation lorsque celle-ci
            est requise.
            <br />
            <br />
            Toute reproduction, représentation, modification, adaptation ou
            exploitation, totale ou partielle, des contenus protégés présents
            sur ce site est interdite sans l’autorisation préalable du titulaire
            des droits, sous réserve des exceptions prévues par la législation
            applicable.
          </Typography>
        </LegalSection>

        <LegalSection title="Données personnelles">
          <Typography color="text.secondary">
            Les données personnelles transmises par le formulaire de contact
            sont limitées aux informations nécessaires à la prise de contact :
            <strong>
              &nbsp;nom, adresse e-mail et, de manière facultative, numéro de
              téléphone
            </strong>
            .
            <br />
            <br />
            Ces informations sont utilisées exclusivement par{" "}
            <strong>Nha Dès Records – Nicolas Rousselin</strong> afin de prendre
            connaissance de la demande et d’y répondre. Elles ne sont pas
            enregistrées dans une base de données du site, ne sont pas utilisées
            à des fins de prospection automatisée et ne sont pas transmises à
            des tiers à des fins commerciales.
            <br />
            <br />
            L’envoi du formulaire entraîne la transmission de ces informations
            par l’intermédiaire du prestataire de messagerie{" "}
            <strong>Resend</strong>, puis leur réception dans la boîte
            électronique de Nha Dès Records. Certaines données peuvent ainsi
            être traitées temporairement par les prestataires techniques
            nécessaires à l’acheminement du courrier électronique.
            <br />
            <br />
            Les données sont conservées uniquement pendant la durée nécessaire
            au traitement de la demande et aux échanges qui peuvent en découler,
            sous réserve des éventuelles obligations légales de conservation.
            <br />
            <br />
            Conformément à la réglementation applicable en matière de protection
            des données personnelles, vous pouvez demander l’accès, la
            rectification ou l’effacement des données vous concernant, ainsi
            que, lorsque cela est applicable, exercer vos droits à la limitation
            ou à l’opposition au traitement.
            <br />
            <br />
            Pour exercer vos droits ou pour toute question concernant vos
            données personnelles, vous pouvez contacter Nha Dès Records à
            l’adresse <strong>contact@nhadesrecords.fr</strong>.
            <br />
            <br />
            Vous disposez également du droit d’introduire une réclamation auprès
            de la Commission nationale de l’informatique et des libertés (CNIL).
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
