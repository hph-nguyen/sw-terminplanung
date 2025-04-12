import { Box, Typography } from "@mui/material";

export default function BlockoutEvent(blockout) {
  return (
    <Box
      sx={{
        backgroundColor: "lightgray",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Typography color="gray" fontWeight="bold" fontSize="small" textAlign="center">
        {blockout.name}
      </Typography>
    </Box>
  );
}
