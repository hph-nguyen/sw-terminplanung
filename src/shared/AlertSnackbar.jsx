import { Snackbar, Alert, AlertTitle } from "@mui/material";

const AlertSnackbar = ({
  open,
  onClose,
  message,
  severity,
  duration = 5000,
  position = { vertical: "top", horizontal: "right" },
}) => {
  return (
    <Snackbar open={open} anchorOrigin={position} autoHideDuration={duration} onClose={onClose}>
      <Alert onClose={onClose} severity={severity || "error"} sx={{ width: "100%" }}>
        <AlertTitle>
          <strong>{message}</strong>
        </AlertTitle>
      </Alert>
    </Snackbar>
  );
};

export default AlertSnackbar;
