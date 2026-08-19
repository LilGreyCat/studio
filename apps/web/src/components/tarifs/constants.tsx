import type { Formule, Prestation } from "./types";

const formules = [
  {
    id: "single",
    titre: "FORMULE SINGLE",
    color: "divider",
    description: (
      <>
        Enregistrement SANS LIMTE DE TEMPS
        <br />
        Mixage
        <br />
        Mastering
      </>
    ),
    tarif: { prix: "100 €" },
  },
  {
    id: "ep",
    titre: "FORMULE EP",
    color: "text.secondary",
    description: "À partir de 4 titres ( EP / Mixtape )",
    tarif: {
      prix: "80 €",
      unit: "/ titre",
    },
  },
  {
    id: "album",
    titre: "FORMULE ALBUM",
    color: "text.primary",
    description: "À partir de 8 titres",
    tarif: {
      prix: "60 €",
      unit: "/ titre",
    },
  },
] satisfies Formule[];

const prestations = [
  {
    id: "recording",
    key: "enregistrement",
    titre: (
      <>
        ENREGISTREMENT
        <br />
        (2 heures minimum)
      </>
    ),
    description: "Recording + Edition",
    tarif: {
      prix: "30 €",
      unit: "/ heure",
    },
    iconPath: "/icons/enregistrement.svg",
  },
  {
    id: "mixing",
    key: "mixage",
    titre: <>MIXAGE</>,
    description:
      "Mixage de l’ensemble du titre Retouches possibles si nécessaire",
    tarif: {
      prix: "40 €",
      unit: "/ titre",
    },
    iconPath: "/icons/mixage.svg",
  },
  {
    id: "mastering",
    key: "mastering",
    titre: <>MASTERING</>,
    description: "Mastering final du titre",
    tarif: {
      prix: "20 €",
      unit: "/ titre",
    },
    iconPath: "/icons/mastering.svg",
  },
] satisfies Prestation[];

export { formules, prestations };
