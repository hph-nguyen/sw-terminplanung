import { Dialog, DialogContent, DialogActions, Button, Avatar, Box, Typography } from "@mui/material";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import PriorityHighRoundedIcon from "@mui/icons-material/PriorityHighRounded";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

const ConfirmDialog = ({
  open,
  onClose,
  msg,
  subMsg,
  confirmLabel = "Ja",
  declineLabel = "Nein",
  onConfirm,
  onDecline,
  type = "info",
  hideButton = false,
  disableBackdropClick = false,
}) => {
  const handleClose = (event, reason) => {
    if (disableBackdropClick && reason === "backdropClick") {
      return; // Prevent closing when clicking the backdrop
    }
    onClose();
  };
  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogContent sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
        <Avatar
          sx={{
            bgcolor: type === "error" ? "#F5A9A9" : type === "info" ? "#89CFF0" : "#FFC107",
            width: 60,
            height: 60,
          }}
        >
          {type === "error" && <PriorityHighRoundedIcon color="error" sx={{ width: 40, height: 40 }} />}
          {type === "info" && <QuestionMarkIcon color="info" sx={{ width: 40, height: 40 }} />}
          {type === "warning" && <WarningAmberIcon color="warning" sx={{ width: 40, height: 40 }} />}
        </Avatar>
        <Typography sx={{ textAlign: "center", fontWeight: "bold" }}>{msg}</Typography>
        {subMsg && <Box sx={{ fontWeight: 500, textAlign: "center" }}>{subMsg}</Box>}
      </DialogContent>
      {!hideButton && (
        <DialogActions sx={{ display: "flex", flexDirection: "row", width: "100%", px: 2, pb: 2 }}>
          <Button color="info" variant="contained" onClick={onConfirm} sx={{ width: "50%" }}>
            {confirmLabel}
          </Button>
          <Button color="error" variant="contained" onClick={onDecline} sx={{ width: "50%" }}>
            {declineLabel}
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};

export default ConfirmDialog;
