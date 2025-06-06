import { Box, Typography } from "@mui/material";
import { deepPurple } from "@mui/material/colors";

export default function ExtApptEvent({ appointment, isMonthView }) {
  if (appointment) {
    const { time, rhythmus, details = "" } = appointment;

    return (
      <Box
        sx={{
          userSelect: "none",
          backgroundColor: deepPurple[100],
          p: 1,
          height: "100%",
          color: "black",
          ...(isMonthView && { overflow: "hidden", height: 22, pt: 0 }),
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
            </>
          )}
        </Box>
      </Box>
    );
  }
}
