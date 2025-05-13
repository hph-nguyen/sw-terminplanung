import { useCallback, useMemo, useRef, useState } from "react";
import { VIEW_OPTIONS } from "../../constants";
import ApptEvent from "./ApptEvent";
import dayjs from "dayjs";
import { Views } from "react-big-calendar";
import { Box, Button, ButtonGroup, Typography, useMediaQuery } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { redAccent } from "../../theme";
import "./calendar.css";
import { ArrowBack, ArrowForward } from "@mui/icons-material";
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

dayjs.locale("de");

const DnDCalendar = withDragAndDrop(BigCalendar);
const localizer = dayjsLocalizer(dayjs);

export default function Schedule({ height, events = [], resources = [], handleOnSelectEvent, handleOnSlotSelect }) {
  // const [semesterStart, setSemesterStart] = useState(getFirstMonday(sessionStorage.getItem("semesterStart")));
  const semesterStart = useRef(getFirstMonday(sessionStorage.getItem("semesterStart")));
  const [date, setDate] = useState(dayjs(semesterStart.current));
  const [view, setView] = useState(Views.WEEK);
  const [groupResourcesOnWeek, setGroupResourcesOnWeek] = useState(true);
  const showDatePicker = useMediaQuery("(min-width:1080px)");
  // const [contextMenuInfo, setContextMenuInfo] = useState();

  // const [semesterStart, setSemesterStart] = useState(getFirstMonday(sessionStorage.getItem("semesterStart")));
  // const [semesterEnde, setSemesterEnde] = useState(sessionStorage.getItem("semesterEnde"));
  // const [exdates, setExdates] = useState([]);
  // const [feiertage, setFeiertage] = useState([]);

  // const [resources, setResources] = useState([]);
  // const [roomsList, setRoomsList] = useState([]);
  // const [events, setEvents] = useState([]);

  // const [anchorEl, setAnchorEl] = useState(null);
  // const [selectedEvent, setSelectedEvent] = useState({});
  // const [popoverColor, setPopoverColor] = useState("");

  // const endeSH1 = useRef(null);

  // useEffect(() => {
  //   const getRoomsList = async () => {
  //     try {
  //       const res = await apiService.getRoomsList(sessionStorage.getItem("currentSemester"), "sw");
  //       const roomsList = res.data.map((el) => el.name);
  //       const temp = res.data.map((el) => {
  //         return {
  //           id: el.name,
  //           title: `${el.name} (${el.platzzahl})`,
  //         };
  //       });
  //       setRoomsList(roomsList);
  //       setResources(temp);
  //       return roomsList;
  //     } catch (e) {
  //       console.log(e);
  //     }
  //   };
  //   const fetchAll = async () => {
  //     await getSemesterhaelfte();
  //     const rooms = await getRoomsList();
  //     const { exdates, feiertage } = await getExDates();
  //     await getGeplanteTermine(rooms, exdates, feiertage);
  //   };
  //   fetchAll();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  const onSlotSelect = ({ start, end }) => {
    if (view !== Views.MONTH) {
      handleOnSlotSelect({ start, end });
    }
  };

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

  // // Nur das ISODatum endSH1 wird genommen.
  // const getSemesterhaelfte = async () => {
  //   const res = await apiService.getSemesterhaelfte(sessionStorage.getItem("currentSemester"));
  //   if (res.status === 200) endeSH1.current = res.data.endeSH1;
  //   else console.log(res);
  // };

  // const getExDates = async () => {
  //   try {
  //     const res = await apiService.getFeiertage(sessionStorage.getItem("currentSemester"));

  //     if (res?.status === 200 && res.data) {
  //       const exdates = res.data.map((el) => el.tag);
  //       const feiertage = res.data;
  //       setExdates(exdates);
  //       setFeiertage(feiertage);
  //       return { exdates, feiertage };
  //     } else {
  //       console.log(res);
  //       return { exdates: [], feiertage: [] };
  //     }
  //   } catch (e) {
  //     console.log(e);
  //     return { exdates: [], feiertage: [] };
  //   }
  // };

  // const getGeplanteTermine = async (resources = [], exdates = [], feiertage = []) => {
  //   try {
  //     const res = await apiService.getAllGeplanteTermine(sessionStorage.getItem("currentSemester"));
  //     // console.log(res.data);
  //     if (res?.status === 200) {
  //       if (res.data) {
  //         /**
  //          * SW-Appt
  //          */
  //         const termine = res.data
  //           .filter((t) => t.id !== "ext")
  //           .map((t) => {
  //             /**
  //              * Event Color:
  //              * Green: BK
  //              * Blue: W & VZ
  //              * Yellow: Termin wird geändert
  //              * Red: Termin wird storniert
  //              */
  //             let color;
  //             let zusatzInfo = "";
  //             if (t.status === t.wunschtermin.status) {
  //               if (t.rhythmus === "BK") color = "green";
  //               else color = "blue";
  //             } else {
  //               if (t.wunschtermin.status === "geaendert") {
  //                 color = "yellow";
  //                 zusatzInfo = "Wunschetermin wird geändert, bitte aktualisieren";
  //               } else {
  //                 zusatzInfo = "Wunschetermin wird storniert, bitte aktualisieren";
  //                 color = "red";
  //               }
  //             }
  //             /**
  //              * Event start and end time
  //              */
  //             let start = dayjs(semesterStart);
  //             let end = dayjs(semesterEnde);
  //             // cal Total Weeks
  //             const totalWeeks = end.diff(start, "week");
  //             const firstHalfWeeks = Math.floor(totalWeeks / 2);

  //             if (t.rhythmus !== "BK") {
  //               start = dayjs(`${semesterStart}T${t.anfangszeit}`).toDate();
  //               end = dayjs(`${semesterEnde}T${formatDauerZuEndzeit(t.anfangszeit, t.dauer)}`).toDate();
  //               if (t.rhythmus === "VZ") {
  //                 start = dayjs(`${t.start_datum}T${t.anfangszeit}`).toDate();
  //                 if (t.semesterhaelfte === "1") {
  //                   end = dayjs(start).add(firstHalfWeeks, "week").toDate();
  //                 }
  //               }
  //             } else {
  //               start = dayjs(`${t.start_datum}T${t.anfangszeit}`).toDate();
  //               end = dayjs(`${t.start_datum}T${formatDauerZuEndzeit(t.anfangszeit, t.dauer)}`).toDate();
  //             }
  //             return {
  //               wochentag: t.wochentag ? t.wochentag : dayjs(t.datum).day(),
  //               start: start,
  //               end: end,
  //               data: {
  //                 appointment: {
  //                   id: t.id,
  //                   color: color,
  //                   time: `${t.anfangszeit} - ${formatDauerZuEndzeit(t.anfangszeit, t.dauer)}`,
  //                   details: `${t.termin_name}\n${t.wunschtermin.dozent}`,
  //                   rhythmus: t.rhythmus,
  //                 },
  //               },
  //               rawData: t,
  //               isDraggable: true,
  //               resourceId: t.raum,
  //               dauer: t.dauer,
  //               zusatzInfo: zusatzInfo,
  //             };
  //           });

  //         /**
  //          * Externe Termine
  //          */
  //         const extTermine = res.data
  //           .filter((t) => t.id === "ext")
  //           .map((t) => {
  //             let start;
  //             let end;
  //             let rhythmus = t.rhythmus;
  //             const evenStartWeek = dayjs(semesterStart).week() % 2 === 0;
  //             if (t.rhythmus === "G" || t.rhythmus === "U") {
  //               rhythmus = "VZ";
  //             }
  //             const anfangszeit = normalizeTime(t.anfangszeit);
  //             if (t.rhythmus !== "BK") {
  //               start = dayjs(`${semesterStart}T${anfangszeit}`).toDate();
  //               end = dayjs(`${semesterEnde}T${formatDauerZuEndzeit(anfangszeit, t.dauer)}`).toDate();
  //               if (t.semesterhaelfte === "1") {
  //                 end = dayjs(`${endeSH1.current}T${formatDauerZuEndzeit(anfangszeit, t.dauer)}`).toDate();
  //               }
  //               if (t.semesterhaelfte === "2") {
  //                 start = dayjs(`${endeSH1.current}T${anfangszeit}`).add(1, "d").toDate();
  //               }
  //               if (evenStartWeek) {
  //                 if (t.rhythmus === "U") {
  //                   start = dayjs(`${dayjs(start).add(1, "week").format("YYYY-MM-DD")}T${anfangszeit}`).toDate();
  //                 }
  //               }
  //               if (!evenStartWeek) {
  //                 if (t.rhythmus === "G") {
  //                   start = dayjs(`${dayjs(start).add(1, "week").format("YYYY-MM-DD")}T${anfangszeit}`).toDate();
  //                 }
  //               }
  //             } else {
  //               start = dayjs(`${t.start_datum}T${anfangszeit}`).toDate();
  //               end = dayjs(`${t.start_datum}T${formatDauerZuEndzeit(anfangszeit, t.dauer)}`).toDate();
  //             }
  //             return {
  //               wochentag: t.wochentag ? t.wochentag : dayjs(t.datum).day(),
  //               start: start,
  //               end: end,
  //               data: {
  //                 extAppt: {
  //                   id: t.id,
  //                   time: `${anfangszeit} - ${formatDauerZuEndzeit(anfangszeit, t.dauer)}`,
  //                   details: `(EXTERN) ${t.termin_name}\n${t.benutzer_id}`,
  //                   rhythmus: rhythmus,
  //                 },
  //               },
  //               rawData: t,
  //               isDraggable: false,
  //               resourceId: t.raum,
  //               dauer: t.dauer,
  //             };
  //           });
  //         const ruleEvents = transformAndGenerateRecurringEvent(termine, exdates);
  //         const ruleExtEvents = transformAndGenerateRecurringEvent(extTermine, exdates, "extAppt");
  //         const blockoutEvents = addFeiertagBlockout(feiertage, resources);
  //         const events = [...ruleEvents, ...blockoutEvents, ...ruleExtEvents];
  //         setEvents(events);
  //       } else {
  //         console.log(res);
  //       }
  //     }
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };

  // const addFeiertagBlockout = (feiertage, resources) => {
  //   const blockout = feiertage.map((e) => {
  //     return {
  //       start: dayjs(`${e.tag}T08:00:00`).toDate(),
  //       end: dayjs(`${e.tag}T21:00:00`).toDate(),
  //       data: {
  //         blockout: {
  //           id: "blk",
  //           name: e.beschreibung,
  //         },
  //       },
  //       isDraggable: false,
  //       resourceId: resources,
  //     };
  //   });
  //   return blockout;
  // };

  // const transformAndGenerateRecurringEvent = (events, exdates, appointmentKey = "appointment") => {
  //   let allEvents = [];

  //   events.forEach((event) => {
  //     const appointment = event.data?.[appointmentKey];

  //     if (appointment) {
  //       if (appointment.rhythmus !== "BK") {
  //         const recurring = generateRecurringEvents(
  //           {
  //             id: appointment.id,
  //             start: event.start,
  //             end: event.end,
  //             resourceId: event.resourceId,
  //             weekday: event.wochentag,
  //             rhythmus: appointment.rhythmus,
  //             dauer: event.dauer,
  //             originalEvent: appointment,
  //             rawData: event.rawData,
  //           },
  //           exdates,
  //           appointmentKey
  //         );
  //         allEvents.push(...recurring);
  //       } else {
  //         allEvents.push(event);
  //       }
  //     } else {
  //       allEvents.push(event);
  //     }
  //   });

  //   return allEvents;
  // };

  // const handleOnSelectEvent = (event, e) => {
  //   e.stopPropagation();
  //   if (event?.data.appointment) {
  //     setPopoverColor(event.data.appointment.color);
  //     setSelectedEvent(event.rawData);
  //     setAnchorEl(e.currentTarget);
  //   }
  // };

  // const handleClosePopover = () => {
  //   setAnchorEl(null);
  //   // setSelectedEvent({});
  // };

  // const onSelectEvent = (event, e) => {
  //   handleOnSelectEvent(event, e);
  // };

  const components = {
    event: ({ event }) => {
      const data = event?.data;
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
  // const [draggedEvent, setDraggedEvent] = useState();

  const onChangeEventTime = useCallback(({ event, start, end, resourceId }) => {
    console.log(event, start, end, resourceId);
  }, []);

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
        </label>{" "}
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
              onChange={(date) => {
                setDate(dayjs(date).locale("de"));
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
              minHeight: `70px !important`,
            },
          }}
        >
          <DnDCalendar
            selectable
            popup
            localizer={localizer}
            events={events}
            // defaultDate={semesterStart}
            defaultView={"week"}
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
            draggableAccessor={(event) => !!event.isDraggable}
            onEventDrop={onChangeEventTime}
            resizableAccessor={() => false}
            // resizableAccessor={"isResizable"}
            // onEventResize={onChangeEventTime}
          />
          {/* <EventPopover anchorEl={anchorEl} onClose={handleClosePopover} event={selectedEvent} color={popoverColor} /> */}
        </Box>
      </Box>
    </>
  );
}
