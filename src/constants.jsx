import { blue, green, red, amber } from "@mui/material/colors";
import dayjs from "dayjs";
import { Views } from "react-big-calendar";

export const EVENT_COLOR = {
  blue: blue[100],
  green: green[100],
  yellow: amber[200],
  red: red[200],
};

export const VIEW_OPTIONS = [
  { id: Views.MONTH, label: "Monat" },
  { id: Views.WEEK, label: "Woche" },

  { id: Views.DAY, label: "Tag" },
];

/**
 * Dummy data to test
 */
export const RESOURCES = [
  { id: "BB006", title: "BB006" },
  { id: "BB203", title: "BB203" },
  { id: "BLT01", title: "BLT01" },
  { id: "BL317", title: "BL317" },
  { id: "BL312", title: "BL312" },
  { id: "BL315", title: "BL315" },
  { id: "BB006", title: "BB006" },
  { id: "BB203", title: "BB203" },
  { id: "BLT01", title: "BLT01" },
  { id: "BL317", title: "BL317" },
  { id: "BL312", title: "BL312" },
  { id: "BL315", title: "BL315" },
];
export const EVENTS = [
  {
    wochentag: 0,
    start: dayjs("2025-04-10T10:00:00").toDate(),
    end: dayjs("2025-06-10T11:00:00").toDate(),
    data: {
      appointment: {
        id: 1,
        color: "yellow",
        time: "10:00 - 11:00",
        details: "Test Recurring Event\nSub String",
        rhythmus: "W",
      },
    },
    isDraggable: true,
    resourceId: "BB.103",
    dauer: 60,
  },
  {
    wochentag: 1,
    start: dayjs("2025-04-10T08:00:00").toDate(),
    end: dayjs("2025-04-10T09:30:00").toDate(),
    data: {
      appointment: {
        id: 2,
        color: "green",
        time: "8:00 - 09:30",
        details: "Termin 1\nSub String",
        rhythmus: "BK",
      },
    },
    isDraggable: true,
    resourceId: "BB.006",
    dauer: 90,
  },
  {
    start: dayjs("2025-04-11T08:00:00").toDate(),
    end: dayjs("2025-04-11T21:00:00").toDate(),
    data: {
      blockout: {
        id: 1,
        name: "Background Event",
      },
    },
    isDraggable: false,
    resourceId: ["BB.103", "BB.006"],
  },
  {
    wochentag: 2,
    start: dayjs("2025-04-10T12:00:00").toDate(),
    end: dayjs("2025-06-10T14:00:00").toDate(),
    data: {
      appointment: {
        id: 3,
        color: "blue",
        time: "12:00 - 14:00",
        details: "Termin 2\nSub String",
        rhythmus: "VZ",
      },
    },
    isDraggable: false,
    resourceId: "BB.103",
    dauer: 120,
  },
];
