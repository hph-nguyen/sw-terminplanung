/* eslint-disable no-unused-vars */
import { RRule } from "rrule";
import DemoCustomCalendar from "./DemoCustomCalendar";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const Benutzerverwaltung = () => {
  const rule = new RRule({
    freq: RRule.WEEKLY,
    dtstart: new Date(Date.UTC(2025, 2, 12, 12, 3, 0)),
    until: new Date(Date.UTC(2025, 4, 21, 12, 3, 0)),
    byweekday: RRule.WE,
  });

  // Generate recurring dates
  const dates = rule.all();

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DemoCustomCalendar />
      </LocalizationProvider>
    </>
  );
};

export default Benutzerverwaltung;
