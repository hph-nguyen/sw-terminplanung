// eslint-disable-next-line no-unused-vars
import { Box, Paper, Typography } from "@mui/material";
import { useState } from "react"; // Import useState hook
import GebuchtTermine from "./GebuchtTermine";
import Schedule from "./Schedule";
import MUIAccordion from "../../shared/MUIAccordion";
import { redAccent } from "../../theme";

const Terminplanung = () => {
  const [scheduleHeight, setScheduleHeight] = useState("45vh");

  const handleAccordionChange = (event, isExpanded) => {
    if (isExpanded) {
      setScheduleHeight("45vh");
    } else {
      setScheduleHeight("75vh");
    }
  };

  return (
    <>
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
          <GebuchtTermine height="30vh" />
        </MUIAccordion>
        <Schedule height={scheduleHeight} />
      </Paper>
    </>
  );
};

export default Terminplanung;
