import { Box, Typography } from "@mui/material";
import { EVENT_COLOR } from "../../constants";

export default function ApptEvent({ appointment, isMonthView }) {
  if (appointment) {
    const { time, status, resource, details = "" } = appointment;
    const bgColor = EVENT_COLOR[status];

    return (
      <Box
        sx={{
          userSelect: "none",
          backgroundColor: bgColor,
          p: 1,
          height: "100%",
          color: "black",
          ...(isMonthView && { overflow: "hidden", height: 22, pt: 0 }),
        }}
        draggable={false}
        onDragStart={(e) => {
          e.stopPropagation();
        }}
      >
        <Box sx={{ alignItems: "center", justifyContent: "space-between", display: "flex" }}>
          <Typography variant="h7" fontWeight={600}>
            {time}
          </Typography>
          <Typography variant="h7" fontWeight={600}>
            {resource}
          </Typography>
        </Box>
        <Box>
          {!isMonthView &&
            details.split("\n").map((detail, index) => (
              <Typography variant="h7" key={index}>
                {detail} <br />
              </Typography>
            ))}
        </Box>
      </Box>
    );
  }
}
