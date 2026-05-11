import LogoutIcon from "@mui/icons-material/Logout";
import IconButton from "@mui/material/IconButton";

type LogoutButtonProps = {
  onClick: () => void;
  disabled?: boolean;
};

export default function LogoutButton({
  onClick,
  disabled = false,
}: LogoutButtonProps) {
  return (
    <IconButton onClick={onClick} disabled={disabled} aria-label="logout">
      <LogoutIcon sx={{ height: "30px", width: "30px" }} />
    </IconButton>
  );
}
