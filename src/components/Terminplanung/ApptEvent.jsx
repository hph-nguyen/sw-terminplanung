import { Box, Typography } from "@mui/material";
import { EVENT_COLOR } from "../../constants";

export default function ApptEvent({ appointment, isMonthView }) {
  if (appointment) {
    const { location, status, resource, address = "" } = appointment;
    const bgColor = EVENT_COLOR[status];

    return (
      <Box
        sx={{
          userSelect: "none",
          backgroundColor: bgColor,
          p: 1,
          height: "100%",
          color: "black",
          ...(isMonthView && {
            overflow: "hidden",
          }),
        }}
        draggable={false}
        onDragStart={(e) => {
          e.stopPropagation();
        }}
      >
        <Box sx={{ alignItems: "center", justifyContent: "space-between", display: "flex" }}>
          <Typography variant="h7" fontWeight={600}>
            {location}
          </Typography>
          <Typography variant="h7" fontWeight={600}>
            {resource}
          </Typography>
        </Box>
        <Box>
          {!isMonthView &&
            address.split("\n").map((add, index) => (
              <Typography variant="h7" key={index}>
                {add} <br />
              </Typography>
            ))}
        </Box>
      </Box>
    );
  }
}
