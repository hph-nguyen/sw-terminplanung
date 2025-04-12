/* eslint-disable no-unused-vars */
import { useCallback, useMemo, useState } from "react";
import dayjs from "dayjs";
import "dayjs/locale/de";
import weekOfYear from "dayjs/plugin/weekOfYear";
import { Calendar, Views, dayjsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./Calendar.css";
import timezone from "dayjs/plugin/timezone";
import { Paper } from "@mui/material";
import CustomWeekView from "./CustomWeekView";
import { redAccent } from "../../theme";
import { generateRecurringEvents } from "../../services/timeUtils";

dayjs.extend(timezone);
dayjs.locale("de");

dayjs.extend(weekOfYear);

const djLocalizer = dayjsLocalizer(dayjs);

const CustomToolbar = ({ label, onNavigate, onView, date, view }) => {
  const kw = dayjs(date).week();
  return (
    <div className="rbc-toolbar">
      <span className="rbc-btn-group">
        <button onClick={() => onNavigate("PREV")}>Zurück</button>
        <button onClick={() => onNavigate("TODAY")}>Heute</button>
        <button onClick={() => onNavigate("NEXT")}>Weiter</button>
      </span>
      <span className="rbc-toolbar-label">
        <strong>
          {view === Views.WEEK && kw && `KW ${kw} /`} {label}
        </strong>
      </span>
      <span className="rbc-btn-group">
        <button onClick={() => onView("month")}>Monat</button>
        <button onClick={() => onView("week")}>Woche</button>
        <button onClick={() => onView("day")}>Tag</button>
      </span>
    </div>
  );
};

const resources = [
  { resourceId: "BB006", resourceTitle: "BB006" },
  { resourceId: "BB203", resourceTitle: "BB203" },
  { resourceId: "BLT01", resourceTitle: "BLT01" },
  { resourceId: "BL317", resourceTitle: "BL317" },
  { resourceId: "BL312", resourceTitle: "BL312" },
  { resourceId: "BL315", resourceTitle: "BL315" },
];

const eventFromAPI = {
  id: 3,
  title: "RR-Event",
  start: dayjs("2025-03-01T08:00").toDate(),
  end: dayjs("2025-05-30T23:00").toDate(),
  resourceId: "BL317",
  weekday: "0",
  turnus: "W",
  dauer: 90,
};
// const eventFromAPI2 = {
//   id: 3,
//   title: "RR-Event",
//   start: dayjs("2025-03-31T08:00").toDate(),
//   end: dayjs("2025-05-19T00:00").toDate(),
//   resourceId: "BL317",
//   weekday: "0",
//   turnus: "W",
//   dauer: 90
// };

// Use the generateRecurringEvents function to create recurring events
const recurringEvents = generateRecurringEvents(eventFromAPI);
// const newEvents = generateRecurringEvents(eventFromAPI2)

const events = [...recurringEvents];

// console.log(events);

const ColoredDateCellWrapper = ({ children }) => {
  return <div style={{ backgroundColor: redAccent[100] }}>{children}</div>;
};

export default function Schedule({ ...props }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState(Views.WEEK);
  const [groupResourcesOnWeek, setGroupResourcesOnWeek] = useState(true);

  const { components, defaultDate, max, min, views } = useMemo(
    () => ({
      components: {
        timeSlotWrapper: ColoredDateCellWrapper,
        toolbar: CustomToolbar,
      },
      defaultDate: dayjs("2025-13-15").toDate(),
      min: dayjs().startOf("day").add(8, "hours").toDate(),
      max: dayjs().endOf("day").subtract(2.5, "hours").toDate(),
      views: {
        month: true,
        day: true,
        week: CustomWeekView,
      },
    }),
    []
  );

  // Handle date click in Month View
  const handleSelectSlot = (slot) => {
    if (holidays.some((holiday) => dayjs(slot.start).isSame(dayjs(holiday), "day"))) {
      alert("This date is a holiday, you cannot select it.");
      return; // Prevent view change
    }

    // If it's not a holiday, proceed with switching views
    if (currentView === Views.MONTH) {
      setCurrentDate(slot.start);
      setCurrentView(Views.WEEK);
    }
  };
  const handleSelectEvent = (event) => {
    // When click on Event in Month View --> Jump back to Week View
    if (currentView === Views.MONTH) {
      const eventDate = event.start;
      setCurrentDate(eventDate);
      setCurrentView(Views.WEEK);
    }
  };

  // const backgroundEvents = [
  //   {
  //     title: "Background event",
  //     start: dayjs("2025-03-28T08:00").toDate(),
  //     end: dayjs("2025-03-28T21:00").toDate(), // Ensure it fits within max time
  //     resourceId: "BB006",
  //   }
  // ];

  const holidays = ["2025-03-28", "2025-04-15", "2025-12-25"]; // Add more dates as needed

  // const dayPropGetter = useCallback(
  //   (date) => {
  //     return holidays.some((holiday) => dayjs(date).isSame(dayjs(holiday), 'day'))
  //       ? {
  //           style: {
  //             backgroundColor: 'lightgray',
  //           },
  //         }
  //       : {};
  //   },
  //   []
  // );

  return (
    <Paper elevation={0}>
      <div style={{ margin: "0 0 10px 0" }}>
        <label>
          <input
            type="checkbox"
            checked={groupResourcesOnWeek}
            onChange={() => setGroupResourcesOnWeek(!groupResourcesOnWeek)}
          />
          Gruppieren Räume in Tag
        </label>
      </div>
      <div style={{ height: props.height }} {...props}>
        <Calendar
          selectable
          culture="de"
          components={components}
          date={currentDate}
          view={currentView}
          events={events}
          // backgroundEvents={backgroundEvents}
          dayLayoutAlgorithm="no-overlap"
          localizer={djLocalizer}
          min={min}
          max={max}
          showMultiDayTimes
          views={views}
          defaultView={"week"}
          defaultDate={defaultDate}
          onNavigate={(date) => {
            setCurrentDate(date);
          }}
          onView={(view) => {
            setCurrentView(view);
          }}
          step={15}
          onSelecting={() => {}} // available in only Time View (week, work_week)
          onSelectSlot={handleSelectSlot} // available in all views (week, work_week, day, month)
          onSelectEvent={handleSelectEvent}
          resources={resources}
          resourceIdAccessor="resourceId"
          resourceTitleAccessor="resourceTitle"
          resourceGroupingLayout={groupResourcesOnWeek}
          // dayPropGetter={dayPropGetter}
        />
      </div>
    </Paper>
  );
}
