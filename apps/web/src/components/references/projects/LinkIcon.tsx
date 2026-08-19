import { IconButton } from "@mui/material";

import { iconPaths } from "@/components/footer/socialLinks/constants";
import type { CustomIconKey } from "@/components/footer/socialLinks/types";
import CustomIcon from "@/components/ui/CustomIcon";
import type { LinkIconAction } from "../types";

import { iconSx } from "./styles";

type LinkIconProps = {
  icon: CustomIconKey;
  action: LinkIconAction;
};

export default function LinkIcon({ icon, action }: LinkIconProps) {
  function handleClick(): void {
    if (action.type === "external_link") {
      window.open(action.href, "_blank", "noopener,noreferrer");
      return;
    }

    action.onClick();
  }

  return (
    <IconButton onClick={handleClick}>
      <CustomIcon icon={iconPaths[icon]} sx={iconSx} />
    </IconButton>
  );
}
