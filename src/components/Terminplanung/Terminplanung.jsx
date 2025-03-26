/* eslint-disable no-unused-vars */
import { Box, Paper, Typography } from "@mui/material";
import GebuchtTermine from "./GebuchtTermine";
import Schedule from "./Schedule";

const Terminplanung = () => {
  return (
    <>
      <Paper sx={{ width: "100%", overflow: "auto" }} elevation={0}>
        <Typography variant="h4" color="primary">
          <strong>Gebuchte Termine</strong>
        </Typography>
        <GebuchtTermine />
        <Schedule />
      </Paper>
    </>
  );
};

export default Terminplanung;
