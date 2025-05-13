/* eslint-disable no-unused-vars */
import { Box, Paper } from "@mui/material";
import Schedule from "./Schedule";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import MUIAccordion from "../../shared/MUIAccordion";
import { redAccent } from "../../theme";
import { useEffect, useRef, useState } from "react";
import EventPopover from "./EventPopover";
import * as apiService from "../../services/apiService";
import {
  formatDauerZuEndzeit,
  generateRecurringEvents,
  getFirstMonday,
  normalizeTime,
  numberToWeekday,
  formatTimeRange,
} from "../../services/timeUtils";
import dayjs from "dayjs";
import WunschTermine from "./WunschTermine";

const Terminplanung = () => {
  const [scheduleHeight, setScheduleHeight] = useState("48vh");
  const [tableHeight, setTableHeight] = useState("30vh");

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState({});
  const [popoverColor, setPopoverColor] = useState("");

  const [semesterStart, setSemesterStart] = useState(getFirstMonday(sessionStorage.getItem("semesterStart")));
  const [semesterEnde, setSemesterEnde] = useState(sessionStorage.getItem("semesterEnde"));
  const [exdates, setExdates] = useState([]);
  const [feiertage, setFeiertage] = useState([]);

  const [wTermine, setWTermine] = useState([]);

  const [resources, setResources] = useState([]);
  const [roomsList, setRoomsList] = useState([]);
  const [events, setEvents] = useState([]);

  const endeSH1 = useRef(null);

  useEffect(() => {
    getWunschtermine();
    const getRoomsList = async () => {
      try {
        const res = await apiService.getRoomsList(sessionStorage.getItem("currentSemester"), "sw");
        const roomsList = res.data.map((el) => el.name);
        const temp = res.data.map((el) => {
          return {
            id: el.name,
            title: `${el.name} (${el.platzzahl})`,
          };
        });
        setRoomsList(roomsList);
        setResources(temp);
        return roomsList;
      } catch (e) {
        console.log(e);
      }
    };
    const fetchAll = async () => {
      await getSemesterhaelfte();
      const rooms = await getRoomsList();
      const { exdates, feiertage } = await getExDates();
      await getGeplanteTermine(rooms, exdates, feiertage);
    };
    getWunschtermine();
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Nur das ISODatum endSH1 wird genommen.
  const getSemesterhaelfte = async () => {
    const res = await apiService.getSemesterhaelfte(sessionStorage.getItem("currentSemester"));
    if (res.status === 200) endeSH1.current = res.data.endeSH1;
    else console.log(res);
  };

  const getWunschtermine = async () => {
    try {
      const res = await apiService.getAllWunschtermine(sessionStorage.getItem("currentSemester"));
      if (Array.isArray(res.data)) {
        const terminList = res.data.map((el) => ({
          id: el.id,
          dozent: el.dozent,
          module: `${el.modul_id} ${el.modul_titel}`,
          lv_titel: el.lv_titel ? el.lv_titel : el.lv_frei_titel,
          block_titel: el.block_titel,
          rhythmus: el.rhythmus,
          vformat: el.vformat,
          lv_termin: el.wochentag
            ? `${numberToWeekday(el.wochentag)},  ${formatTimeRange(el.anfangszeit, el.dauer)}`
            : `${dayjs(el.start_datum).format("DD.MM.YYYY")},  ${formatTimeRange(el.anfangszeit, el.dauer)}`,
          start_datum: el.wochentag ? el.start_datum : "",
          raum_wunsch: el.raum_wunsch,
          co_dozent: el.co_dozent,
          max_tn: el.max_tn,
          warteliste_len: el.warteliste_len,
          status: el.status,
          rawData: { ...el },
        }));
        setWTermine(terminList);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const getExDates = async () => {
    try {
      const res = await apiService.getFeiertage(sessionStorage.getItem("currentSemester"));

      if (res?.status === 200 && res.data) {
        const exdates = res.data.map((el) => el.tag);
        const feiertage = res.data;
        setExdates(exdates);
        setFeiertage(feiertage);
        return { exdates, feiertage };
      } else {
        console.log(res);
        return { exdates: [], feiertage: [] };
      }
    } catch (e) {
      console.log(e);
      return { exdates: [], feiertage: [] };
    }
  };

  const getGeplanteTermine = async (resources = [], exdates = [], feiertage = []) => {
    try {
      const res = await apiService.getAllGeplanteTermine(sessionStorage.getItem("currentSemester"));
      // console.log(res.data);
      if (res?.status === 200) {
        if (res.data) {
          /**
           * SW-Appt
           */
          const termine = res.data
            .filter((t) => t.id !== "ext")
            .map((t) => {
              /**
               * Event Color:
               * Green: BK
               * Blue: W & VZ
               * Yellow: Termin wird geändert
               * Red: Termin wird storniert
               */
              let color;
              let zusatzInfo = "";
              if (t.status === t.wunschtermin.status) {
                if (t.rhythmus === "BK") color = "green";
                else color = "blue";
              } else {
                if (t.wunschtermin.status === "geaendert") {
                  color = "yellow";
                  zusatzInfo = "Wunschetermin wird geändert, bitte aktualisieren";
                } else {
                  zusatzInfo = "Wunschetermin wird storniert, bitte aktualisieren";
                  color = "red";
                }
              }
              /**
               * Event start and end time
               */
              let start = dayjs(semesterStart);
              let end = dayjs(semesterEnde);
              // cal Total Weeks
              const totalWeeks = end.diff(start, "week");
              const firstHalfWeeks = Math.floor(totalWeeks / 2);

              if (t.rhythmus !== "BK") {
                start = dayjs(`${semesterStart}T${t.anfangszeit}`).toDate();
                end = dayjs(`${semesterEnde}T${formatDauerZuEndzeit(t.anfangszeit, t.dauer)}`).toDate();
                if (t.rhythmus === "VZ") {
                  start = dayjs(`${t.start_datum}T${t.anfangszeit}`).toDate();
                  if (t.semesterhaelfte === "1") {
                    end = dayjs(start).add(firstHalfWeeks, "week").toDate();
                  }
                }
              } else {
                start = dayjs(`${t.start_datum}T${t.anfangszeit}`).toDate();
                end = dayjs(`${t.start_datum}T${formatDauerZuEndzeit(t.anfangszeit, t.dauer)}`).toDate();
              }
              return {
                wochentag: t.wochentag ? t.wochentag : dayjs(t.datum).day(),
                start: start,
                end: end,
                data: {
                  appointment: {
                    id: t.id,
                    color: color,
                    time: `${t.anfangszeit} - ${formatDauerZuEndzeit(t.anfangszeit, t.dauer)}`,
                    details: `${t.termin_name}\n${t.wunschtermin.dozent}`,
                    rhythmus: t.rhythmus,
                  },
                },
                rawData: t,
                isDraggable: true,
                resourceId: t.raum,
                dauer: t.dauer,
                zusatzInfo: zusatzInfo,
              };
            });

          /**
           * Externe Termine
           */
          const extTermine = res.data
            .filter((t) => t.id === "ext")
            .map((t) => {
              let start;
              let end;
              let rhythmus = t.rhythmus;
              const evenStartWeek = dayjs(semesterStart).week() % 2 === 0;
              if (t.rhythmus === "G" || t.rhythmus === "U") {
                rhythmus = "VZ";
              }
              const anfangszeit = normalizeTime(t.anfangszeit);
              if (t.rhythmus !== "BK") {
                start = dayjs(`${semesterStart}T${anfangszeit}`).toDate();
                end = dayjs(`${semesterEnde}T${formatDauerZuEndzeit(anfangszeit, t.dauer)}`).toDate();
                if (t.semesterhaelfte === "1") {
                  end = dayjs(`${endeSH1.current}T${formatDauerZuEndzeit(anfangszeit, t.dauer)}`).toDate();
                }
                if (t.semesterhaelfte === "2") {
                  start = dayjs(`${endeSH1.current}T${anfangszeit}`).add(1, "d").toDate();
                }
                if (evenStartWeek) {
                  if (t.rhythmus === "U") {
                    start = dayjs(`${dayjs(start).add(1, "week").format("YYYY-MM-DD")}T${anfangszeit}`).toDate();
                  }
                }
                if (!evenStartWeek) {
                  if (t.rhythmus === "G") {
                    start = dayjs(`${dayjs(start).add(1, "week").format("YYYY-MM-DD")}T${anfangszeit}`).toDate();
                  }
                }
              } else {
                start = dayjs(`${t.start_datum}T${anfangszeit}`).toDate();
                end = dayjs(`${t.start_datum}T${formatDauerZuEndzeit(anfangszeit, t.dauer)}`).toDate();
              }
              return {
                wochentag: t.wochentag ? t.wochentag : dayjs(t.datum).day(),
                start: start,
                end: end,
                data: {
                  extAppt: {
                    id: t.id,
                    time: `${anfangszeit} - ${formatDauerZuEndzeit(anfangszeit, t.dauer)}`,
                    details: `(EXTERN) ${t.termin_name}\n${t.benutzer_id}`,
                    rhythmus: rhythmus,
                  },
                },
                rawData: t,
                isDraggable: false,
                resourceId: t.raum,
                dauer: t.dauer,
              };
            });
          const ruleEvents = transformAndGenerateRecurringEvent(termine, exdates);
          const ruleExtEvents = transformAndGenerateRecurringEvent(extTermine, exdates, "extAppt");
          const blockoutEvents = addFeiertagBlockout(feiertage, resources);
          const events = [...ruleEvents, ...blockoutEvents, ...ruleExtEvents];
          setEvents(events);
        } else {
          console.log(res);
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  const addFeiertagBlockout = (feiertage, resources) => {
    const blockout = feiertage.map((e) => {
      return {
        start: dayjs(`${e.tag}T08:00:00`).toDate(),
        end: dayjs(`${e.tag}T21:00:00`).toDate(),
        data: {
          blockout: {
            id: "blk",
            name: e.beschreibung,
          },
        },
        isDraggable: false,
        resourceId: resources,
      };
    });
    return blockout;
  };

  const transformAndGenerateRecurringEvent = (events, exdates, appointmentKey = "appointment") => {
    let allEvents = [];

    events.forEach((event) => {
      const appointment = event.data?.[appointmentKey];

      if (appointment) {
        if (appointment.rhythmus !== "BK") {
          const recurring = generateRecurringEvents(
            {
              id: appointment.id,
              start: event.start,
              end: event.end,
              resourceId: event.resourceId,
              weekday: event.wochentag,
              rhythmus: appointment.rhythmus,
              dauer: event.dauer,
              originalEvent: appointment,
              rawData: event.rawData,
            },
            exdates,
            appointmentKey
          );
          allEvents.push(...recurring);
        } else {
          allEvents.push(event);
        }
      } else {
        allEvents.push(event);
      }
    });

    return allEvents;
  };

  const handleOnSelectEvent = (event, e) => {
    e.stopPropagation();
    if (event?.data.appointment) {
      setPopoverColor(event.data.appointment.color);
      setSelectedEvent(event.rawData);
      setAnchorEl(e.currentTarget);
    }
  };

  const handleOnSlotSelect = ({ start, end }) => {
    console.log("handleOnSlotSelect: ", start, end);
  };

  const handleAccordionChange = (event, isExpanded) => {
    if (isExpanded) {
      setTableHeight("30vh");
      setScheduleHeight("48vh");
      setTableHeight("30vh");
      setScheduleHeight("48vh");
    } else {
      setTableHeight("1vh");
      setScheduleHeight("75vh");
    }
  };

  // const handleCancelClick = async (rowData) => {
  //   if (!window.confirm("Sind Sie sicher, diese Buchung zu stornieren?")) return;

  //   const updated = { ...rowData, status: "storniert" };
  //   Object.keys(updated).forEach((k) => (updated[k] ??= ""));

  //   const res = await apiService.putWunschTermin(
  //     sessionStorage.getItem("currentSemester"),
  //     updated,
  //     updated.benutzer_id
  //   );

  //   if (res.status === 200) {
  //     await getWunschtermine();
  //   } else {
  //     console.error(res);
  //   }
  // };

  const onWunschterminStornieren = () => {
    getGeplanteTermine();
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
    // setSelectedEvent({});
  };

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }} elevation={0}>
      <MUIAccordion
        disableGutters={true}
        header={
          <Box
            sx={{
              position: "relative",
              display: "inline-block",
              cursor: "pointer",
              "&::after": {
                content: '""',
                position: "absolute",
                left: 0,
                bottom: "-2px",
                width: "100%",
                height: "2px",
                backgroundColor: redAccent[500],
                transform: "scaleX(0)",
                transition: "transform 0.3s ease-in-out",
              },
              "&:hover::after, &:focus::after": {
                transform: "scaleX(1)",
              },
            }}
          >
            Wunschtermine
          </Box>
        }
        elevation="0"
        defaultExpanded={true}
        onChange={handleAccordionChange}
        sxSummary={{ padding: 0 }}
        sxDetails={{ padding: 0 }}
      >
        <WunschTermine
          height={tableHeight}
          onCancleAppt={onWunschterminStornieren}
          rows={wTermine}
          getWunschtermine={getWunschtermine}
        />
      </MUIAccordion>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Schedule
          height={scheduleHeight}
          handleOnSelectEvent={handleOnSelectEvent}
          handleOnSlotSelect={handleOnSlotSelect}
          resources={resources}
          events={events}
        />
      </LocalizationProvider>

      <EventPopover anchorEl={anchorEl} onClose={handleClosePopover} event={selectedEvent} color={popoverColor} />
    </Paper>
  );
};

export default Terminplanung;
