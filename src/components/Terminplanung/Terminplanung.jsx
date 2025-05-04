/* eslint-disable no-unused-vars */
import { RRule } from "rrule";
import { Box, Paper } from "@mui/material";
import Schedule from "./Schedule";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import GebuchtTermine from "./GebuchtTermine";
import MUIAccordion from "../../shared/MUIAccordion";
import { redAccent } from "../../theme";
import { useState } from "react";
import { useEffect } from "react";
import * as apiService from "../../services/apiService";

const Terminplanung = () => {
  const [scheduleHeight, setScheduleHeight] = useState("48vh");
  const [tableHeight, setTableHeight] = useState("30vh");

  const handleAccordionChange = (event, isExpanded) => {
    if (isExpanded) {
      setTableHeight("30vh");
      setScheduleHeight("48vh");
      setTableHeight("30vh");
      setScheduleHeight("48vh");
    } else {
      setTableHeight(0);
      setTableHeight(0);
      setScheduleHeight("75vh");
    }
  };

  return (
    <Paper sx={{ width: "100%", overflow: "auto" }} elevation={0}>
      <MUIAccordion
        disableGutters={true}
        header={
          <Box
            sx={{
              position: "relative",
              display: "inline-block",
              cursor: "pointer",
              "&::after": {
                content: '""',
                position: "absolute",
                left: 0,
                bottom: "-2px",
                width: "100%",
                height: "2px",
                backgroundColor: redAccent[500],
                transform: "scaleX(0)",
                transition: "transform 0.3s ease-in-out",
              },
              "&:hover::after, &:focus::after": {
                transform: "scaleX(1)",
              },
            }}
          >
            Gebuchte Termine
          </Box>
        }
        elevation="0"
        defaultExpanded={true}
        onChange={handleAccordionChange}
        sxSummary={{ padding: 0 }}
        sxDetails={{ padding: 0 }}
      >
        <GebuchtTermine height={tableHeight} />
      </MUIAccordion>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Schedule height={scheduleHeight} />
      </LocalizationProvider>
    </Paper>
  );
};

export default Terminplanung;
