/* eslint-disable no-unused-vars */
import { Box, Paper, Typography } from "@mui/material";
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
import AlertSnackbar from "../../shared/AlertSnackbar";
import MUIDialog from "../../shared/MUIDialog";
import EditTerminForm from "./EditTerminForm";
import { sanitizeNulls } from "../../services/utils";
import { Co2Sharp } from "@mui/icons-material";

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
  const [terminToEdit, setTerminToEdit] = useState([]);

  const [calResources, setCalResources] = useState([]);
  const [resourcesIds, setRoomsList] = useState([]);

  const [events, setEvents] = useState([]);
  const [tableEvents, setTableEvents] = useState([]);

  const [openForm, setOpenForm] = useState(false);

  const [alertMsg, setAlertMsg] = useState("");
  const [alert, setAlert] = useState(false);
  const [alertType, setAlertType] = useState("");

  const semester = useRef(sessionStorage.getItem("currentSemester"));
  const endeSH1 = useRef(null);

  const channel = new BroadcastChannel("wunschtermineChannel");

  useEffect(() => {
    const handleChannelMessage = async (event) => {
      // console.log("Terminplanung received message:", event.data);
      if (event.data === "update") {
        fetchAll();
      }
    };

    channel.addEventListener("message", handleChannelMessage);
    return () => {
      channel.removeEventListener("message", handleChannelMessage);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    getSemesterhaelfte();

    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const fetchAll = async () => {
    const resources = await getRoomsList();
    const { exdates, feiertage } = await getExDates();
    await getGeplanteTermine(resources, exdates, feiertage);
  };

  // Nur das ISODatum endSH1 wird genommen.
  const getSemesterhaelfte = async () => {
    const res = await apiService.getSemesterhaelfte(sessionStorage.getItem("currentSemester"));
    if (res.status === 200) endeSH1.current = res.data.endeSH1;
    else console.log(res);
  };

  const getRoomsList = async () => {
    try {
      const res = await apiService.getRoomsList(semester.current, "sw");
      const resourcesIds = res.data.map((el) => el.name);
      const temp = res.data.map((el) => {
        return {
          id: el.name,
          title: `${el.name} (${el.platzzahl})`,
        };
      });
      setRoomsList(resourcesIds);
      setCalResources(temp);
      return resourcesIds;
    } catch (e) {
      console.log(e);
    }
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
    // console.log(feiertage);
    try {
      const res = await apiService.getAllGeplanteTermine(sessionStorage.getItem("currentSemester"));
      // console.log(res.data);
      if (res?.status === 200) {
        if (res.data) {
          /**
           * SW-Appt
           */
          const tableEvents = res.data
            .filter((t) => t.id !== "ext")
            .map((t) => {
              return {
                ...t,
                zeit: t.wochentag
                  ? `${numberToWeekday(t.wochentag)},  ${formatTimeRange(t.anfangszeit, t.dauer)}`
                  : `${dayjs(t.start_datum).format("DD.MM.YYYY")},  ${formatTimeRange(t.anfangszeit, t.dauer)}`,
              };
            });
          setTableEvents(tableEvents);
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
              zusatzInfo: event.zusatzInfo,
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

  // Klicken auf Kalendar, um Termin zu buchen --> noch nicht verfügbar
  // Um die Funktion verfügbar zu machen, unkommentiert "selectable" prop in Schedule DnDCalendar als TRUE
  const handleOnSlotSelect = ({ start, end }) => {
    console.log("handleOnSlotSelect: ", start, end);
  };

  // Height anpassen
  const handleAccordionChange = (_, isExpanded) => {
    if (isExpanded) {
      setTableHeight("30vh");
      setScheduleHeight("46vh");
    } else {
      setTableHeight("0vh");
      setScheduleHeight("75vh");
    }
  };

  const handleDeleteAppt = async (selectedEvent) => {
    try {
      const res = await apiService.deleteTermin(semester.current, selectedEvent);
      if (res.status === 200) {
        setAlert(true);
        setAlertMsg("Termin wird erfolgereich gelöscht");
        setAlertType("success");
        setAnchorEl(null);
      } else {
        setAlert(true);
        setAlertMsg("Etwas ist schiefgelaufen, Termin kann nicht gelöscht werden");
      }
      await getWunschtermine();
      await getGeplanteTermine(resourcesIds, exdates, feiertage);
    } catch (error) {
      console.error("Delete failed:", error);
      setAlert(true);
      setAlertMsg("Fehler beim Löschen des Termins");
      setAlertType("error");
      await getWunschtermine();
    }
    channel.postMessage("update");
  };

  const onEditClick = (e) => {
    setOpenForm(true);
    setAnchorEl(null);
    const data = sanitizeNulls(e);
    const temp = { ...data, vformat: data.wunschtermin.vformat.split(",") };
    setTerminToEdit(temp);
  };

  const handleEditAppt = async (event) => {
    const { bis, wunschtermin, vformat, ...rest } = event;
    const sendEvent = { ...rest, vformat: vformat.toString() };
    try {
      const res = await apiService.putTermin(semester.current, sendEvent);
      if (res.status === 200) {
        setAlert(true);
        setAlertMsg("Termin wird erfolgereich geändert");
        setAlertType("success");
        setAnchorEl(null);
        await getWunschtermine();
        await getGeplanteTermine(resourcesIds, exdates, feiertage);
      } else if (res.status === 409) {
        const msg = res.response.data.substring(res.response.data.indexOf(":") + 1).trim();
        setAlert(true);
        setAlertMsg(`Termin kann nicht ändert werden. Grund: ${msg}`);
      } else {
        console.log(res);
        setAlert(true);
        setAlertMsg("Etwas ist schiefgelaufen, Termin kann nicht ändert werden");
      }
      await getWunschtermine();
    } catch (error) {
      console.error("Delete failed:", error);
      setAlert(true);
      setAlertMsg("Fehler beim Aändern des Termins");
      setAlertType("error");
      await getWunschtermine();
    }
    setOpenForm(false);
    channel.postMessage("update");
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
        sxSummary={{ py: 0, pl: 1, pr: 2.5 }}
        sxDetails={{ p: 0 }}
      >
        <WunschTermine height={tableHeight} rowData={wTermine} getWunschtermine={getWunschtermine} />
      </MUIAccordion>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Schedule
          height={scheduleHeight}
          handleOnSelectEvent={handleOnSelectEvent}
          handleOnSlotSelect={handleOnSlotSelect}
          resources={calResources}
          events={events}
          tableRows={tableEvents}
          onTableDeleteTermin={handleDeleteAppt}
          onTableEditTermin={(e) => {
            onEditClick(e);
          }}
        />
      </LocalizationProvider>

      <EventPopover
        anchorEl={anchorEl}
        onClose={handleClosePopover}
        event={selectedEvent}
        color={popoverColor}
        onDeleteClick={() => handleDeleteAppt(selectedEvent)}
        onEditClick={() => onEditClick(selectedEvent)}
      />
      <AlertSnackbar
        open={alert}
        onClose={() => {
          setAlert(false);
          setTimeout(() => {
            setAlertMsg("");
            setAlertType(false);
          }, 500);
        }}
        message={alertMsg}
        severity={alertType}
      ></AlertSnackbar>
      <MUIDialog
        onOpen={openForm}
        onClose={() => setOpenForm(false)}
        content={
          <EditTerminForm
            initialValues={terminToEdit}
            onSubmit={(e) => handleEditAppt(e)}
            onCloseForm={() => setOpenForm(false)}
            roomsOpt={calResources.map((el) => ({ value: el.id, label: el.title }))}
          />
        }
        disableBackdropClick="true"
        title={
          <Typography variant="h4" fontWeight={600}>
            Termin ändern
          </Typography>
        }
      />
    </Paper>
  );
};

export default Terminplanung;
