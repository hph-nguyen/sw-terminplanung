import { useCallback, useMemo, useRef, useState } from "react";
import { VIEW_OPTIONS } from "../../constants";
import ApptEvent from "./ApptEvent";
import dayjs from "dayjs";
import { Views } from "react-big-calendar";
import { Box, Button, ButtonGroup, Tooltip, Typography, useMediaQuery } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { redAccent } from "../../theme";
import "./calendar.css";
import { ArrowBack, ArrowForward, InsertInvitationOutlined, WindowOutlined } from "@mui/icons-material";
import CustomWeekView from "./CustomWeekView";
import BlockoutEvent from "./BlockoutEvent";
import { Calendar as BigCalendar, dayjsLocalizer } from "react-big-calendar";
import "dayjs/locale/de";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
// import * as apiService from "../../services/apiService";
import { getFirstMonday } from "../../services/timeUtils";
import ExtApptEvent from "./ExtApptEvent";
import GeplanteTerminTabelle from "./GeplanteTerminTabelle";

dayjs.locale("de");

const DnDCalendar = withDragAndDrop(BigCalendar);
const localizer = dayjsLocalizer(dayjs);

export default function Schedule({
  height,
  events = [],
  resources = [],
  handleOnSelectEvent,
  handleOnSlotSelect,
  onTableDeleteTermin,
  onTableEditTermin,
  tableRows = [],
}) {
  // const [semesterStart, setSemesterStart] = useState(getFirstMonday(sessionStorage.getItem("semesterStart")));
  const semesterStart = useRef(getFirstMonday(sessionStorage.getItem("semesterStart")));
  const [date, setDate] = useState(
    sessionStorage.getItem("currentDate") ? dayjs(sessionStorage.getItem("currentDate")) : dayjs(semesterStart.current)
  );
  const [view, setView] = useState(
    sessionStorage.getItem("currentView") ? sessionStorage.getItem("currentView") : "week"
  );
  const [groupResourcesOnWeek, setGroupResourcesOnWeek] = useState(false);
  const showDatePicker = useMediaQuery("(min-width:1080px)");

  const [scheduleView, setScheduleView] = useState(true);

  const onSlotSelect = ({ start, end }) => {
    if (view !== Views.MONTH) {
      handleOnSlotSelect({ start, end });
    }
  };

  const onPrevClick = useCallback(() => {
    let newDate;

    if (view === Views.DAY) {
      newDate = dayjs(date).subtract(1, "d");
    } else if (view === Views.WEEK) {
      newDate = dayjs(date).subtract(1, "w");
    } else {
      newDate = dayjs(date).subtract(1, "M");
    }

    setDate(newDate);
    sessionStorage.setItem("currentDate", dayjs(newDate).local("de").toISOString());
  }, [view, date]);

  const onNextClick = useCallback(() => {
    let newDate;

    if (view === Views.DAY) {
      newDate = dayjs(date).add(1, "d");
    } else if (view === Views.WEEK) {
      newDate = dayjs(date).add(1, "w");
    } else {
      newDate = dayjs(date).add(1, "M");
    }

    setDate(newDate);
    sessionStorage.setItem("currentDate", dayjs(newDate).local("de").toISOString());
  }, [view, date]);

  const dateText = useMemo(() => {
    const d = dayjs(date);
    if (view === Views.DAY) return d.format("dddd, DD.MM.YYYY");
    if (view === Views.WEEK) {
      const from = d.startOf("week");
      const to = d.endOf("week");
      const kw = d.week();
      return `KW ${kw} - ${from.format("DD.MM")} bis ${to.format("DD.MM")}`;
    }
    if (view === Views.MONTH) {
      return d.format("MMMM YYYY");
    }
  }, [view, date]);

  const components = {
    event: ({ event }) => {
      const data = event?.data;
      // console.log("zusatzInfo", event.zusatzInfo);

      if (data?.appointment)
        return (
          <ApptEvent appointment={data?.appointment} isMonthView={view === Views.MONTH} zusatzInfo={event.zusatzInfo} />
        );
      if (data?.blockout) {
        return <BlockoutEvent blockout={data?.blockout} />;
      }
      if (data?.extAppt) {
        return <ExtApptEvent appointment={data?.extAppt} isMonthView={view === Views.MONTH} />;
      }

      return null;
    },
  };
  // const [draggedEvent, setDraggedEvent] = useState();

  // const onChangeEventTime = useCallback(({ event, start, end, resourceId }) => {
  //   console.log(event, start, end, resourceId);
  // }, []);

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
      <div style={{ margin: "0 16px 0 10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        {scheduleView ? (
          <label>
            <input
              type="checkbox"
              checked={groupResourcesOnWeek}
              onChange={() => setGroupResourcesOnWeek(!groupResourcesOnWeek)}
            />
            Gruppieren Räume in Tag
          </label>
        ) : (
          <Box></Box>
        )}
        <ButtonGroup disableElevation size="small">
          <Tooltip title="Tabellenansicht" arrow>
            <Button variant={scheduleView ? "outlined" : "contained"} onClick={() => setScheduleView(false)}>
              <WindowOutlined fontSize="small" />
            </Button>
          </Tooltip>
          <Tooltip title="Kalenderansicht" arrow>
            <Button
              variant={scheduleView ? "contained" : "outlined"}
              onClick={() => {
                setScheduleView(true);
              }}
            >
              <InsertInvitationOutlined fontSize="small" />
            </Button>
          </Tooltip>
        </ButtonGroup>
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
        {scheduleView && (
          <>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              {showDatePicker && (
                <DatePicker
                  color={"primary"}
                  value={date}
                  onChange={(date) => {
                    setDate(dayjs(date).locale("de"));
                    sessionStorage.setItem("currentDate", date.toISOString());
                  }}
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
              {/* CustomToolbar */}
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
                    onClick={() => {
                      sessionStorage.setItem("currentView", id);
                      sessionStorage.setItem("currentDate", date.toISOString());
                      setView(id);
                    }}
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
                  minHeight: `70px !important`,
                },
              }}
            >
              <DnDCalendar
                // selectable
                popup
                localizer={localizer}
                events={events}
                // defaultDate={semesterStart}
                // defaultView={Views.DAY}
                // onSelectEvent={(event, e) => onSelectEvent(event, e)}
                onSelectEvent={handleOnSelectEvent}
                min={dayjs("2025-04-10T08:00:00").toDate()}
                max={dayjs("2025-04-10T21:00:00").toDate()}
                resources={resources}
                // Custom Props
                resourceGroupingLayout={groupResourcesOnWeek}
                // Components
                components={components}
                // set False to use CustomToolbar (above)
                toolbar={false}
                culture="de"
                date={date}
                view={view}
                views={views}
                step={15}
                timeslots={4}
                onView={setView}
                onNavigate={(date) => setDate(dayjs(date))}
                onSelectSlot={onSlotSelect}
                // CURRENTLY  draggableAccessor IS NOT AVAILABLE, therefor, in timeUtils.jsx generateRecurringEvents(), isDraggable set by default as false
                draggableAccessor={(event) => !!event.isDraggable}
                // onEventDrop={onChangeEventTime}
                resizableAccessor={() => false}
                // resizableAccessor={"isResizable"}
                // onEventResize={onChangeEventTime}
              />
            </Box>
          </>
        )}
        {!scheduleView && (
          <GeplanteTerminTabelle
            rows={tableRows}
            onDeleteTermin={onTableDeleteTermin}
            onEditTermin={onTableEditTermin}
          ></GeplanteTerminTabelle>
        )}
      </Box>
    </>
  );
}
