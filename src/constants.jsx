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
  { id: 1, title: "Dr Alex" },
  { id: 2, title: "Dr John" },
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
    resourceId: 1,
  },
  {
    start: dayjs("2025-04-10T12:00:00").toDate(),
    end: dayjs("2025-04-10T13:00:00").toDate(),
    data: {
      appointment: {
        id: 2,
        status: "blau",
        location: "Washington",
        resource: "Dr David",
        address: "Block 1\nStreet 32\nLong Island\nNew York",
      },
    },
    resourceId: 2,
  },
  {
    start: dayjs("2025-04-13T10:00:00").toDate(),
    end: dayjs("2025-04-13T13:00:00").toDate(),
    data: {
      blockout: {
        id: 1,
        name: "Independence Day",
      },
    },
  },
];
