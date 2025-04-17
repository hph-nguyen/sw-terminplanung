/* eslint-disable no-unused-vars */
import { cloneElement, useCallback, useEffect, useMemo, useState } from "react";
import { RESOURCES, EVENTS, EVENT_COLOR, VIEW_OPTIONS } from "../../constants";
import ApptEvent from "./ApptEvent";
import dayjs from "dayjs";
import { Views } from "react-big-calendar";
import { Box, Button, ButtonGroup, IconButton, Slider, Stack, Typography, useMediaQuery } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { redAccent } from "../../theme";
import "./calendar.css";
import { ArrowBack, ArrowForward, ChevronLeft, ZoomIn, ZoomOut } from "@mui/icons-material";
import CustomWeekView from "./CustomWeekView";
import BlockoutEvent from "./BlockoutEvent";
import { Calendar as BigCalendar, dayjsLocalizer } from "react-big-calendar";
import "dayjs/locale/de";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import * as apiService from "../../services/apiService";

dayjs.locale("de");

const DnDCalendar = withDragAndDrop(BigCalendar);
const localizer = dayjsLocalizer(dayjs);

const mapLines = (nthChild, width) =>
  `.rbc-day-slot .rbc-time-slot:nth-child(${nthChild}):after {width: ${width}% !important;}`;

const TimeSlotMinutes = Object.freeze({
  Five: 5,
  Ten: 10,
  Fifteen: 15,
  Thirty: 30,
});

const timeSlotLinesMap = {
  [TimeSlotMinutes.Five]: `${mapLines("6n + 4", 25)} ${mapLines("3n + 2", 12.5)} ${mapLines("3n + 3", 12.5)}`,
  [TimeSlotMinutes.Ten]: `${mapLines("3n + 2", 12.5)} ${mapLines("3n + 3", 12.5)}`,
  [TimeSlotMinutes.Fifteen]: mapLines("2n", 25),
  [TimeSlotMinutes.Thirty]: "",
};

export default function Schedule(height, appt) {
  const [date, setDate] = useState(dayjs(new Date()));
  const [view, setView] = useState(Views.WEEK);
  const [contextMenuInfo, setContextMenuInfo] = useState();
  const [groupResourcesOnWeek, setGroupResourcesOnWeek] = useState(true);
  const [resources, setResources] = useState([]);

  const [zoom, setZoom] = useState([5]);
  const STEP = 5;
  const TIME_SLOTS = 60 / STEP;

  const showDatePicker = useMediaQuery("(min-width:1080px)");

  const getRoomsList = async () => {
    try {
      const res = await apiService.getRoomsList(sessionStorage.getItem("currentSemester"), "sw");
      const temp = res.data.map((el) => {
        return {
          id: el.name,
          title: `${el.name} (${el.platzzahl})`,
        };
      });
      setResources(temp);
      console.log(resources);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getRoomsList();
  }, []);

  const onPrevClick = useCallback(() => {
    if (view === Views.DAY) {
      setDate(dayjs(date).subtract(1, "d"));
    } else if (view === Views.WEEK) {
      setDate(dayjs(date).subtract(1, "w"));
    } else {
      setDate(dayjs(date).subtract(1, "M"));
    }
  }, [view, date]);

  const onNextClick = useCallback(() => {
    if (view === Views.DAY) {
      setDate(dayjs(date).add(1, "d"));
    } else if (view === Views.WEEK) {
      setDate(dayjs(date).add(1, "w"));
    } else {
      setDate(dayjs(date).add(1, "M"));
    }
  }, [view, date]);

  const dateText = useMemo(() => {
    if (view === Views.DAY) return dayjs(date).format("dddd, DD.MM.YYYY");
    if (view === Views.WEEK) {
      const from = dayjs(date)?.startOf("week");
      const to = dayjs(date)?.endOf("week");
      const kw = dayjs(date)?.week();
      return `KW ${kw} - ${from.format("DD.MM")} bis ${to.format("DD.MM")}`;
    }
    if (view === Views.MONTH) {
      return dayjs(date).format("MMMM YYYY");
    }
  }, [view, date]);

  const components = {
    event: ({ event }) => {
      const data = event?.data;
      if (data?.appointment) return <ApptEvent appointment={data?.appointment} isMonthView={view === Views.MONTH} />;

      if (data?.blockout) {
        return <BlockoutEvent blockout={data?.blockout} />;
      }

      return null;
    },
    // timeSlotWrapper: ({ children, value, resource }) => {
    //   return cloneElement(children, {
    //     onContextMenu: (e) => {
    //       e.preventDefault();
    //       setContextMenuInfo({
    //         xPosition: e.clientX,
    //         yPosition: e.clientY,
    //         selectedTime: value,
    //         resourceId: resource,
    //       });
    //     },
    //   });
    // },
  };
  const [draggedEvent, setDraggedEvent] = useState();
  const [events, setEvents] = useState(EVENTS);
  const onChangeEventTime = useCallback(({ event, start, end, resourceId }) => {
    setEvents((prevEvents) =>
      prevEvents.map((prevEvent) => {
        return prevEvent?.data?.appointment?.id === event?.data?.appointment?.id
          ? { ...event, start, end, resourceId }
          : prevEvent;
      })
    );
  }, []);
  const onDroppedFromOutside = useCallback(
    ({ start, end, resource }) => {
      if (draggedEvent === "undroppable") return;
      setEvents((prevEvents) => [
        ...prevEvents,
        {
          start,
          end,
          resourceId: resource,
          data: { appointment: draggedEvent },
          isDraggable: true,
          isResizable: true,
        },
      ]);
    },
    [draggedEvent]
  );

  const views = useMemo(
    () => ({
      week: CustomWeekView,
      day: true,
      month: true,
    }),
    []
  );

  const onTodayClick = useCallback(() => {
    setDate(dayjs());
  }, []);

  return (
    <>
      <div style={{ margin: "0 0 0 10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <label>
          <input
            type="checkbox"
            checked={groupResourcesOnWeek}
            onChange={() => setGroupResourcesOnWeek(!groupResourcesOnWeek)}
          />
          Gruppieren Räume in Tag
        </label>
        <Box sx={{ width: 220 }}>
          <Stack spacing={2} direction="row" sx={{ alignItems: "center", mb: 1 }}>
            <ZoomOut />
            <Slider value={zoom} onChange={(_, newValue) => setZoom(newValue)} min={5} max={20} />
            <ZoomIn />
          </Stack>
        </Box>
      </div>

      <Box
        sx={{
          height: height,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: 2,
          p: 2,
          overflow: "hidden",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          {showDatePicker && (
            <DatePicker
              color={"primary"}
              value={date}
              onChange={(date) => setDate(date)}
              format="DD.MM.YYYY"
              slotProps={{
                textField: {
                  size: "small",
                  sx: {
                    "& .MuiInputBase-root": {
                      border: `1px solid ${redAccent[500]}`,
                      borderRadius: "24px",
                    },
                    "& .MuiInputBase-input": {
                      padding: "2% 5%",
                      fontWeight: "bold",
                    },
                  },
                },
              }}
            />
          )}
          <Box sx={{ display: "flex" }}>
            <Button
              onClick={onTodayClick}
              variant="contained"
              color="secondary"
              sx={{ mr: 1 }}
              disableElevation
              size="small"
            >
              <strong>Heute</strong>
            </Button>
            <ButtonGroup disableElevation>
              <Button variant="contained" color="secondary" onClick={onPrevClick}>
                <ArrowBack fontSize="small" />
              </Button>
              <Box
                sx={{
                  pl: 4,
                  pr: 4,
                  bgcolor: redAccent[500],
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "240px",
                }}
              >
                <Typography fontSize="medium">{dateText}</Typography>
              </Box>
              <Button variant="contained" color="secondary" onClick={onNextClick}>
                <ArrowForward fontSize="small" />
              </Button>
            </ButtonGroup>
          </Box>
          <ButtonGroup size="small">
            {VIEW_OPTIONS.map(({ id, label }) => (
              <Button
                variant="contained"
                disableElevation
                key={id}
                onClick={() => setView(id)}
                {...(id === view
                  ? {
                      color: "primary",
                    }
                  : { color: "secondary" })}
              >
                <strong>{label}</strong>
              </Button>
            ))}
          </ButtonGroup>
        </Box>

        <Box
          sx={{
            height: height,
            width: "100%",
            overflow: "auto",
            position: "relative",
            "& .rbc-timeslot-group": {
              minHeight: `${zoom?.[0] * 14}px !important`,
            },
            ...timeSlotLinesMap?.[STEP],
          }}
        >
          <DnDCalendar
            selectable
            localizer={localizer}
            events={events}
            defaultDate={"2025-04-10"}
            defaultView={"week"}
            min={dayjs("2025-04-10T08:00:00").toDate()}
            max={dayjs("2025-04-10T21:00:00").toDate()}
            resources={resources}
            // Custom Props
            resourceGroupingLayout={groupResourcesOnWeek}
            // Components
            components={components}
            // Toolbar
            toolbar={false}
            date={date}
            view={view}
            views={views}
            onView={setView}
            onNavigate={(date) => setDate(dayjs(date))}
            step={STEP}
            timeslots={TIME_SLOTS}
            onSelectSlot={({ start, end }) => {
              alert(`You selected:\nStart: ${start}\nEnd: ${end}`);
            }}
            draggableAccessor={(event) => !!event.isDraggable}
            resizableAccessor={"isResizable"}
            onEventDrop={onChangeEventTime}
            onEventResize={onChangeEventTime}
            onDropFromOutside={onDroppedFromOutside}
          />
        </Box>
      </Box>
    </>
  );
}
