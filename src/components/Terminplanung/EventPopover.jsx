import { Popover, Paper, Box, Typography, Button } from "@mui/material";
import { EditCalendar, Delete } from "@mui/icons-material";
import { POPOVER_EVENT_COLOR } from "../../constants";

const fields = [
  { label: "WunschterminID", key: "wunschtermin_id" },
  { label: "Dozent", key: "wunschtermin.dozent" },
  {
    label: "Modul",
    keys: ["wunschtermin.modul_id", "wunschtermin.lv_titel"],
    format: (values) => values.filter(Boolean).join(" "),
  },
  { label: "LV-Titel", key: "wunschtermin.lv_titel" },
  { label: "Rhythmus", key: "wunschtermin.rhythmus" },
  { label: "Startdatum", key: "wunschtermin.start_datum" },
  { label: "Kommentar", key: "wunschtermin.anmerkung" },
  { label: "Raum", key: "raum" },
];

const getNestedValue = (obj, path) => path.split(".").reduce((o, k) => (o ? o[k] : null), obj);

export default function EventPopover({ anchorEl, onClose, event = {}, color, onEditClick, onDeleteClick }) {
  const open = Boolean(anchorEl);
  const bgColor = POPOVER_EVENT_COLOR[color];

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: "center", horizontal: "right" }}
      transformOrigin={{ vertical: "center", horizontal: "left" }}
      slotProps={{
        paper: { sx: { backgroundColor: "transparent", boxShadow: "none" } },
      }}
    >
      <Box sx={{ position: "relative", ml: 1 }}>
        <Box sx={{ p: 2, pt: 1, backgroundColor: bgColor, ml: 1 }}>
          <Box sx={{ p: 0.5 }}>
            <Typography variant="h6" fontWeight={600}>
              {event.termin_name}
            </Typography>
          </Box>
          <Paper elevation={1} sx={{ p: 1, mb: 1, bgcolor: "white", color: "#292929" }}>
            {fields.map((field) => {
              const keys = field.keys || [field.key];
              const values = keys.map((k) => getNestedValue(event, k));
              const value = field.format ? field.format(values) : values[0] ?? "-";

              return (
                <Box key={field.label} sx={{ p: 0.25, display: "flex", alignItems: "center" }}>
                  <Typography variant="body2">
                    <b>{field.label}:&nbsp;</b>
                    {value}
                  </Typography>
                </Box>
              );
            })}
          </Paper>
          <Box sx={{ display: "flex", justifyContent: "space-between", gap: 1 }}>
            <Button variant="contained" color="warning" sx={{ flex: 1 }} onClick={onEditClick}>
              <EditCalendar />
            </Button>
            <Button variant="contained" color="error" sx={{ flex: 1 }} onClick={onDeleteClick}>
              <Delete />
            </Button>
          </Box>
        </Box>
      </Box>
    </Popover>
  );
}
