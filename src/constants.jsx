import { blue, green, red, amber } from "@mui/material/colors";
import dayjs from "dayjs";
import { Views } from "react-big-calendar";

export const EVENT_COLOR = {
  blue: blue[100],
  green: green[100],
  yellow: amber[100],
  red: red[100],
};

export const POPOVER_EVENT_COLOR = {
  blue: blue[200],
  green: green[200],
  yellow: amber[200],
  red: red[200],
};

export const VIEW_OPTIONS = [
  { id: Views.MONTH, label: "Monat" },
  { id: Views.WEEK, label: "Woche" },

  { id: Views.DAY, label: "Tag" },
];

export const WEEKDAY = [
  { value: "0", label: "Montag" },
  { value: "1", label: "Dienstag" },
  { value: "2", label: "Mittwoch" },
  { value: "3", label: "Donnerstag" },
  { value: "4", label: "Freitag" },
  { value: "5", label: "Samstag" },
];

export const LV_RHYTHMUS = [
  { value: "W", label: "W - wöchentlich" },
  { value: "WZ", label: "W und BK - wöchentlich mit Zusatzterminen" },
  {
    value: "VZ",
    label: "VZ - vierzehntägig, dafür LV mit doppelter SWS-Zahl",
  },
  {
    value: "VZ2",
    label: "VZ2 - wöchentlich, doppelte SWS-Zahl, aber mit halbierter Anzahl Termine",
  },

  { value: "BK", label: "BK - Blockveranstaltung" },
];

export const TIME_PICKER_VON = [
  { value: "08:00", label: "08:00" },
  { value: "08:45", label: "08:45" },
  { value: "09:45", label: "09:45" },
  { value: "10:30", label: "10:30" },
  { value: "11:30", label: "11:30" },
  { value: "12:15", label: "12:15" },
  { value: "14:00", label: "14:00" },
  { value: "14:45", label: "14:45" },
  { value: "15:45", label: "15:45" },
  { value: "16:30", label: "16:30" },
  { value: "17:30", label: "17:30" },
  { value: "18:15", label: "18:15" },
  { value: "19:15", label: "19:15" },
  { value: "20:00", label: "20:00" },
];

export const TIME_PICKER_BIS = [
  { value: "08:45", label: "08:45" },
  { value: "09:30", label: "09:30" },
  { value: "10:30", label: "10:30" },
  { value: "11:15", label: "11:15" },
  { value: "12:15", label: "12:15" },
  { value: "13:00", label: "13:00" },
  { value: "14:45", label: "14:45" },
  { value: "15:30", label: "15:30" },
  { value: "16:30", label: "16:30" },
  { value: "17:15", label: "17:15" },
  { value: "18:15", label: "18:15" },
  { value: "19:00", label: "19:00" },
  { value: "20:00", label: "20:00" },
  { value: "20:45", label: "20:45" },
];

export const VIRTUELLES_FORMAT = [
  { value: "Präsenz", label: "Präsenz" },
  { value: "Hybrid (synchron)", label: "Hybrid (synchron)" },
  { value: "Hybrid (asynchron)", label: "Hybrid (asynchron)" },
  { value: "Reine Onlineveranstaltung", label: "Reine Onlineveranstaltung" },
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

export const personaltyp = [
  { value: "PF", label: "Professor" },
  { value: "MA", label: "Mitarbeiter" },
  { value: "LB", label: "Labormitarbeiter" },
];

export const zuloeschen = [
  { value: "0", label: "Nein" },
  { value: "1", label: "Ja" },
];
