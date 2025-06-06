import { Box, Typography } from "@mui/material";
import { EVENT_COLOR } from "../../constants";

export default function ApptEvent({ appointment, isMonthView, zusatzInfo = "" }) {
  if (appointment) {
    const { time, color, rhythmus, details = "" } = appointment;
    const bgColor = EVENT_COLOR[color];

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
            {rhythmus}
          </Typography>
        </Box>
        <Box>
          {!isMonthView && (
            <>
              {details.split("\n").map((detail, index) => (
                <Typography variant="h7" key={index}>
                  <strong>{detail}</strong> <br />
                </Typography>
              ))}
              {zusatzInfo && zusatzInfo.trim() !== "" && (
                <Typography variant="h7" color="primary">
                  <i>{zusatzInfo}</i>
                </Typography>
              )}
            </>
          )}
        </Box>
      </Box>
    );
  }
}
