import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Typography } from "@mui/material";

export default function MUIAccordion({
  header,
  defaultExpanded = false,
  children,
  sxSummary,
  sxDetails,
  ...otherProps
}) {
  return (
    <div>
      <Accordion defaultExpanded={defaultExpanded} {...otherProps}>
        <AccordionSummary expandIcon={<ExpandMoreIcon color="primary" />} sx={sxSummary}>
          <Typography variant="h4" color="primary">
            <strong>{header}</strong>
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={sxDetails}>{children}</AccordionDetails>
      </Accordion>
    </div>
  );
}
