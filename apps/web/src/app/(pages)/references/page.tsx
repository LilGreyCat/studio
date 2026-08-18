import Projects from "@/components/references/projects/Projects";
import { Divider, MainLogo } from "@/components/ui";

export const metadata = {
  title: "Références",
  description: "Découvrez les références de Nhadès Records.",
};

export default function References() {
  return (
    <>
      <MainLogo marginBottom={5} />
      <Projects />
      {/* Reserved separator for the future artists section. */}
      <Divider />
    </>
  );
}
