import Artists from "@/components/references/artists/Artists";
import Projects from "@/components/references/projects/Projects";
import { Divider, MainLogo } from "@/components/ui";

export const metadata = {
  title: "Références",
  description: "Découvrez les références de Nha Dès Records.",
};

export default function References() {
  return (
    <>
      <MainLogo marginBottom={5} />
      <Projects />
      <Divider />
      <Artists />
    </>
  );
}
