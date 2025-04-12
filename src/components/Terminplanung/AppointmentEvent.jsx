import { Box, Typography } from "@mui/material";
import { EVENT_STATUS_COLORS } from "../../constants";

export default function AppointmentEvent({ appointment, isMonthView }) {
  const { location, status, resource, address } = appointment;
  const background = EVENT_STATUS_COLORS[status];

  return (
    <Box
      sx={{
        backgroundColor: background,
        padding: 1,
        height: "100%",
        color: "black",
        ...(isMonthView ? { overflow: "hidden", height: 28 } : {}),
      }}
    >
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box>
          <Typography fontSize="0.75rem">{location}</Typography>
        </Box>
        <Box>
          <Typography fontSize="0.75rem">{resource}</Typography>
        </Box>
      </Box>
      <Box mt={2}>
        {address.split("\n").map((add, index) => (
          <Typography key={index} fontSize="0.75rem">
            {add}
          </Typography>
        ))}
      </Box>
    </Box>
  );
}
