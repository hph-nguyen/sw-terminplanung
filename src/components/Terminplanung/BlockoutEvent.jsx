import { Box, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";

export default function BlockoutEvent({ blockout }) {
  return (
    <Box
      sx={{
        backgroundColor: grey[300],
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Typography sx={{ fontWeight: "600", color: "gray", textAlign: "center" }} variant="h6">
        {blockout.name}
      </Typography>
    </Box>
  );
}
