import { Prestation } from "@/components/home/prestations/types";
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

type ServiceProps = {
  services: ServiceId[];
  handleServiceToggle: (service: ServiceId) => void;
  prestation: Prestation;
};

export default function Service({
  services,
  handleServiceToggle,
  prestation,
}: ServiceProps) {
  const isSelected = services.includes(prestation.id);

  return (
    <ButtonBase
      onClick={() => {
        handleServiceToggle(prestation.id);
      }}
      aria-pressed={isSelected}
      aria-label={prestation.title}
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
          component="img"
          src={`/icons/${prestation.icon}.svg`}
          sx={prestationIconSx}
        />
        {prestation.title}
      </Box>
    </ButtonBase>
  );
}
