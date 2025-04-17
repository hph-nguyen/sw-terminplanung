import dayjs from "dayjs";
import { Views } from "react-big-calendar";
export const EVENT_COLOR = {
  blau: "#bee2fa",
  grün: "#c7edca",
};

export const VIEW_OPTIONS = [
  { id: Views.MONTH, label: "Monat" },
  { id: Views.WEEK, label: "Woche" },

  { id: Views.DAY, label: "Tag" },
];

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
    start: dayjs("2025-04-10T10:00:00").toDate(),
    end: dayjs("2025-04-10T11:00:00").toDate(),
    data: {
      appointment: {
        id: 1,
        status: "grün",
        time: "10:00 - 11:00",
        resource: "BB006",
        details: "Termin 3\nSub String",
      },
    },
    isDraggable: true,
    isResizable: true,
    resourceId: "BB006",
    isDraggable: true,
    isResizable: true,
    resourceId: "BB006",
  },
  {
    start: dayjs("2025-04-10T08:00:00").toDate(),
    end: dayjs("2025-04-10T09:30:00").toDate(),
    start: dayjs("2025-04-10T08:00:00").toDate(),
    end: dayjs("2025-04-10T09:30:00").toDate(),
    data: {
      appointment: {
        id: 2,
        status: "blau",
        time: "8:00 - 09:30",
        resource: "BB203",
        details: "Termin 1\nSub String",
      },
    },
    isDraggable: true,
    isResizable: false,
    resourceId: "BB203",
    isDraggable: true,
    isResizable: false,
    resourceId: "BB203",
  },
  {
    start: dayjs("2025-04-11T08:00:00").toDate(),
    end: dayjs("2025-04-11T21:00:00").toDate(),
    start: dayjs("2025-04-11T08:00:00").toDate(),
    end: dayjs("2025-04-11T21:00:00").toDate(),
    data: {
      blockout: {
        id: 1,
        name: "Background Event",
      },
    },
    isDraggable: false,
    isResizable: true,
    resourceId: "BB203",
  },
  {
    start: dayjs("2025-04-10T12:00:00").toDate(),
    end: dayjs("2025-04-10T14:00:00").toDate(),
    data: {
      appointment: {
        id: 3,
        status: "grün",
        time: "12:00 - 14:00",
        resource: "BB006",
        details: "Termin 2\nSub String",
      },
    },
    isDraggable: true,
    isResizable: true,
    resourceId: "BB006",
  },
];
