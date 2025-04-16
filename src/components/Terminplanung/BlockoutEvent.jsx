import { Box, Typography } from "@mui/material";

export default function BlockoutEvent({ blockout }) {
  return (
    <Box sx={{ backgroundColor: "lightgray", height: "100%", alignItems: "center", justifyContent: "center" }}>
      <Typography sx={{ fontWeight: "600", color: "gray", textAlign: "center" }}>{blockout.name}</Typography>
    </Box>
  );
}
