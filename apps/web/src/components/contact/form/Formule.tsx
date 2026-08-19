import { ServiceId } from "@/hooks/contact/useContactForm";
import { Box, ButtonBase } from "@mui/material";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import {
  buttonSx,
  contentSx,
  optionBoxSx,
  prestationIconSx,
  selectedIconSx,
  selectedOptionSx,
} from "./styles";

type formuleId = "single" | "ep" | "album";

export type formule = {
  id: formuleId;
  title: string;
  color: string;
};

type FormuleProps = {
  services: ServiceId[];
  handleServiceToggle: (service: ServiceId) => void;
  formule: formule;
};

export default function Formule({
  services,
  handleServiceToggle,
  formule,
}: FormuleProps) {
  const isSelected = services.includes(formule.id);

  return (
    <ButtonBase
      onClick={() => {
        handleServiceToggle(formule.id);
      }}
      aria-pressed={isSelected}
      aria-label={formule.title}
      sx={buttonSx}
    >
      <Box
        sx={{
          ...optionBoxSx(isSelected),
          ...contentSx,
          ...selectedOptionSx(isSelected),
        }}
      >
        {isSelected && <CheckCircleRoundedIcon aria-hidden="true" sx={selectedIconSx} />}
        <Box
          sx={{
            backgroundColor: formule.color,
            WebkitMask: "url(/icons/formule.svg) no-repeat center",
            mask: "url(/icons/formule.svg) no-repeat center",
            WebkitMaskSize: "contain",
            maskSize: "contain",
            ...prestationIconSx,
          }}
        />
        {formule.title}
      </Box>
    </ButtonBase>
  );
}
