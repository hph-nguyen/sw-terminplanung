import { useMemo, useState } from "react";
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
];

const events = [
  {
    id: 1,
    title: "Langes Ereignis",
    start: dayjs("2025-03-19T08:00").toDate(),
    end: dayjs("2025-03-19T20:00").toDate(),
    resourceId: "BL317",
  },
  {
    id: 5,
    title: "Short Event",
    start: dayjs("2025-03-17T09:00").toDate(),
    end: dayjs("2025-03-17T10:30").toDate(),
    resourceId: "BB006",
  },
];

const ColoredDateCellWrapper = ({ children }) => {
  return <div style={{ backgroundColor: redAccent[100] }}>{children}</div>;
};

export default function Dayjs({ ...props }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState(Views.WEEK);
  const [groupResourcesOnWeek, setGroupResourcesOnWeek] = useState(true);

  const { components, defaultDate, max, min, views } = useMemo(
    () => ({
      components: {
        timeSlotWrapper: ColoredDateCellWrapper,
        toolbar: CustomToolbar,
      },
      defaultDate: new Date(2025, 3, 11),
      min: dayjs().startOf("day").add(8, "hours").toDate(),
      max: dayjs().endOf("day").subtract(3, "hours").toDate(),
      views: {
        month: true,
        day: true,
        week: CustomWeekView,
      },
    }),
    []
  );

  // Handle date click in Month View
  const handleDateClick = (slot) => {
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

  // const dayPropGetter = (date) => {
  //   if (dayjs(date).day() === 0) {
  //     return {
  //       style: {
  //         display: "none", // Hide Sunday
  //       },
  //     };
  //   }
  //   return {};
  // };

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
      <div className="calHeight" {...props}>
        <Calendar
          selectable
          culture="de"
          components={components}
          date={currentDate}
          view={currentView}
          events={events}
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
          onSelectSlot={handleDateClick} // available in all views (week, work_week, day, month)
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
