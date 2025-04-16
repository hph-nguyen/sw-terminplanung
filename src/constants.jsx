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
];
export const EVENTS = [
  {
    start: dayjs("2025-04-10T10:00:00").toDate(),
    end: dayjs("2025-04-10T11:00:00").toDate(),
    data: {
      appointment: {
        id: 1,
        status: "grün",
        location: "New York",
        resource: "Dr Alex",
        address: "Building 5\nStreet 44\nNear Express Highway\nNew York",
      },
    },
    isDraggable: true,
    isResizable: true,
    resourceId: "BB006",
  },
  {
    start: dayjs("2025-04-10T08:00:00").toDate(),
    end: dayjs("2025-04-10T09:30:00").toDate(),
    data: {
      appointment: {
        id: 2,
        status: "blau",
        location: "Washington",
        resource: "Dr David",
        address: "Block 1\nStreet 32\nLong Island\nNew York",
      },
    },
    isDraggable: true,
    isResizable: false,
    resourceId: "BB203",
  },
  {
    start: dayjs("2025-04-11T08:00:00").toDate(),
    end: dayjs("2025-04-11T21:00:00").toDate(),
    data: {
      blockout: {
        id: 1,
        name: "Independence Day",
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
        location: "New York",
        resource: "Dr Alex",
        address: "Building 5\nStreet 44\nNear Express Highway\nNew York",
      },
    },
    isDraggable: true,
    isResizable: true,
    resourceId: "BB006",
  },
];
