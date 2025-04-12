import { Box, Typography } from "@mui/material";
import { EVENT_COLOR } from "../../constants";

export default function ApptEvent({ event, isMonthView }) {
  // Destructure appointment data from event
  const { appointment, blockout } = event?.data || {};

  if (blockout) {
    return null;
  }

  if (appointment) {
    const { location, status, resource, address = "" } = appointment;
    const bgColor = EVENT_COLOR[status];

    return (
      <Box
        sx={{ backgroundColor: bgColor, p: 1, height: "100%", color: "black", overflow: isMonthView ? "hidden" : "" }}
      >
        <Box sx={{ alignItems: "center", justifyContent: "space-between" }}>
          <Typography variant="h7">{"Test Location"}</Typography>
          <Typography variant="h7">{resource}</Typography>
        </Box>
        <Box sx={{ mt: 4 }}>
          {address.split("\n").map((add, index) => (
            <Typography variant="h7" key={index}>
              {add}
            </Typography>
          ))}
        </Box>
      </Box>
    );
  }
}
