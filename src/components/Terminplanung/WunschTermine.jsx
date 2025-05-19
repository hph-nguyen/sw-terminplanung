/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef } from "react";
import { Alert, AlertTitle, Box, Button, Snackbar, Typography } from "@mui/material";
import { GridToolbar, DataGrid, GridActionsCellItem, gridClasses, GridToolbarContainer } from "@mui/x-data-grid";

import { deDE } from "@mui/x-data-grid/locales";
import { redAccent } from "../../theme";

import * as apiService from "../../services/apiService";
import { numberToWeekday, formatTimeRange } from "../../services/timeUtils";
import dayjs from "dayjs";
import { amber, blue, green, grey, red } from "@mui/material/colors";
import { EventAvailable, EventBusy } from "@mui/icons-material";
import { Fullscreen } from "@mui/icons-material";
import MUIDialog from "../../shared/MUIDialog";
import BuchTerminForm from "./BuchTerminForm";
import { TIME_PICKER_VON } from "../../constants";
import AlertSnackbar from "../../shared/AlertSnackbar";

const CustomToolbar = ({ hideFullScreenButton = false, onFullScreenClick }) => {
  const handleOpenFullView = () => {
    if (onFullScreenClick) onFullScreenClick();
    window.open("/sw-terminplanung/wunschtermine", "_blank");
  };

  return (
    <GridToolbarContainer>
      <GridToolbar csvOptions={{ delimiter: ";" }} printOptions={{ disableToolbarButton: true }} />
      {!hideFullScreenButton && (
        <Button color="primary" onClick={handleOpenFullView} size="small">
          <Fullscreen /> Vollbild in neuem Tab öffnen
        </Button>
      )}
    </GridToolbarContainer>
  );
};

const WunschTermine = ({ height = "100%", hideFullScreenButton = false, rowData, onFullScreenClick }) => {
  const [rows, setRows] = useState(rowData);
  const [roomsList, setRoomsList] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [wTerminToBook, setWTerminToBook] = useState({});
  const semester = useRef(sessionStorage.getItem("currentSemester"));
  const [alertMsg, setAlertMsg] = useState("");
  const [alert, setAlert] = useState(false);
  const [alertType, setAlertType] = useState("");

  // Broadcast channel to sync update for multi-Window.
  // So that each change from full screen table will be updated automatically in main window table
  const channel = new BroadcastChannel("wunschtermineChannel");
  useEffect(() => {
    getWunschtermine();
    const handleChannelMessage = (message) => {
      if (message.data === "update") {
        getWunschtermine();
      }
    };
    // Attach event listener to the channel
    channel.addEventListener("message", handleChannelMessage);
    return () => {
      // Remove event listener when component unmounts
      channel.removeEventListener("message", handleChannelMessage);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setRows(rowData);
  }, [rowData]);

  useEffect(() => {
    const getRoomsList = async () => {
      try {
        const res = await apiService.getRoomsList(semester.current, "sw");
        const temp = res.data.map((el) => {
          return {
            value: el.name,
            label: `${el.name} (${el.platzzahl})`,
          };
        });
        setRoomsList(temp);
      } catch (e) {
        console.log(e);
      }
    };
    getRoomsList();
  }, []);

  const handleAddApptClick = (e) => () => {
    if (!e?.row?.rawData) return "";

    const rawData = e.row.rawData;

    // Replace null values with empty strings
    const sanitizedData = Object.fromEntries(
      Object.entries(rawData).map(([key, value]) => [key, value === null ? "" : value])
    );
    sanitizedData.vformat = sanitizedData.vformat ? sanitizedData.vformat.split(",") : [];

    const startTime = TIME_PICKER_VON.filter((item) => item.value === sanitizedData.anfangszeit);
    const temp = {
      id: "0", // DEFAULT ID = 0 FOR POST METHOD
      termin_name: ` ${sanitizedData.modul_id} ${sanitizedData.lv_titel}`,
      wunschtermin_id: sanitizedData.id,
      raum: sanitizedData.raum_wunsch ? sanitizedData.raum_wunsch : "",
      anfangszeit: startTime.length !== 0 ? sanitizedData.anfangszeit : "",
      dauer: sanitizedData.dauer,
      status: "geplant",
      wochentag: sanitizedData.wochentag,
      rhythmus: sanitizedData.rhythmus,
      start_datum: sanitizedData.start_datum,
      semesterhaelfte: "0",
      benutzer_id: sanitizedData.benutzer_id,
      vformat: sanitizedData.vformat,
      wunschtermin: sanitizedData,
    };
    setWTerminToBook(temp);
    setOpenForm(true);
  };

  const handleAddAppt = async (e) => {
    const { vformat, bis, wunschtermin, ...rest } = e;
    const res = await apiService.postNeuenTermin(semester.current, { ...rest, vformat: e.vformat.toString() });
    if (res.status === 200) {
      // if (onAddAppt) onAddAppt();
      channel.postMessage("update");
      getWunschtermine();
      setAlert(true);
      setAlertMsg("Neuen Termin wird erfolgereich hinzugefügt");
      setAlertType("success");
    } else if (res.status === 409) {
      const msg = res.response.data.substring(res.response.data.indexOf(":") + 1).trim();
      console.log(msg);
      setAlert(true);
      setAlertMsg(`Neuen Termin kann nicht hinzugefügt werden. Grund: ${msg}`);
      console.log(res);
    } else {
      setAlert(true);
      setAlertMsg(`Etwas ist schiefgelaufen, neuen Termin kann nicht hinzugefügt werden`);
      console.log(res);
    }
    setOpenForm(false);
  };

  const handleCloseBar = () => {
    setAlert(false);
    setTimeout(() => {
      setAlertMsg("");
      setAlertType(false);
    }, 500);
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
            : ` ${dayjs(el.start_datum).format("DD.MM.YYYY")},  ${formatTimeRange(el.anfangszeit, el.dauer)}`,
          start_datum: el.wochentag ? el.start_datum : "",
          raum_wunsch: el.raum_wunsch,
          co_dozent: el.co_dozent,
          max_tn: el.max_tn,
          warteliste_len: el.warteliste_len,
          status: el.status,
          rawData: { ...el },
        }));
        setRows(terminList);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleCancelClick = (e) => async () => {
    if (window.confirm("Sind Sie sicher, diese Buchung zu stornieren?")) {
      const temp = { ...e.row.rawData, status: "storniert" };
      Object.keys(temp).forEach((key) => {
        if (temp[key] === null) {
          temp[key] = "";
        }
      });

      const benutzerId = e.row.rawData.benutzer_id;
      if (benutzerId) {
        const res = await apiService.putWunschTermin(sessionStorage.getItem("currentSemester"), temp, benutzerId);
        if (res.status === 200) {
          getWunschtermine();
          channel.postMessage("update");
        } else {
          console.log(res);
        }
      }
    }
  };

  const columns = [
    { field: "id", headerName: "ID", editable: false, type: "string", flex: 0.25 },
    { field: "dozent", headerName: "Dozent", editable: false, type: "string", flex: 0.675 },
    { field: "module", headerName: "Modul", editable: false, type: "string", flex: 1.25 },
    { field: "lv_titel", headerName: "LV-Titel", editable: false, type: "string", flex: 1 },
    { field: "block_titel", headerName: "BK-Titel (Opt.)", type: "string", flex: 0.75 },
    { field: "rhythmus", headerName: "Rhythmus", editable: false, type: "string", flex: 0.5 },
    { field: "lv_termin", headerName: "LV-Termin", editable: false, type: "string", flex: 1 },
    { field: "start_datum", headerName: "1. Tag", type: "string", flex: 0.5 },
    { field: "raum_wunsch", headerName: "Raumwunsch", type: "string", flex: 0.5 },
    { field: "co_dozent", headerName: "Co-Dozent", type: "string", flex: 0.5 },
    { field: "max_tn", headerName: "max. TN-Zahl", type: "number", flex: 0.5 },
    { field: "warteliste_len", headerName: "Wartelist", type: "string", flex: 0.5 },
    { field: "anmerkungen", headerName: "Anmerkung", type: "string", flex: 0.5 },
    { field: "vformat", headerName: "Virtuelles Format", type: "string", flex: 0.5 },
    { field: "status", headerName: "Status", editable: false, type: "string", flex: 0.5 },
    {
      field: "actions",
      type: "actions",
      headerName: "Aktion",
      flex: 0.75,
      cellClassName: "actions",
      getActions: (e) => {
        return [
          <GridActionsCellItem
            key="edit"
            icon={<EventAvailable />}
            label="Edit"
            className="textPrimary"
            onClick={handleAddApptClick(e)}
            color="primary"
            disabled={e.row.rawData.status === "storniert" || e.row.rawData.status === "geplant" ? true : false}
          />,
          <GridActionsCellItem
            key="edit"
            icon={<EventBusy />}
            label="Edit"
            className="textPrimary"
            onClick={handleCancelClick(e)}
            color="primary"
            disabled={e.row.rawData.status === "storniert" ? true : false}
          />,
        ];
      },
    },
  ];

  return (
    <Box>
      <Box
        height={height}
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-columnHeader": {
            backgroundColor: grey[300],
            color: redAccent[500],
          },
          "& .MuiDataGrid-columnHeaderTitle": {
            fontWeight: "700",
            fontSize: 13,
          },
          [`.${gridClasses.cell}.geplant`]: {
            backgroundColor: blue[100],
          },
          [`.${gridClasses.cell}.storniert`]: {
            backgroundColor: red[100],
          },
          [`.${gridClasses.cell}.angefragt`]: {
            backgroundColor: green[100],
          },
          [`.${gridClasses.cell}.geaendert`]: {
            backgroundColor: amber[100],
          },
          "& .MuiDataGrid-cell[data-field='id']": {
            fontWeight: "bold",
            color: redAccent[500],
          },
        }}
      >
        <DataGrid
          localeText={deDE.components.MuiDataGrid.defaultProps.localeText}
          initialState={{
            columns: {
              columnVisibilityModel: {
                raum_wunsch: false,
                co_dozent: false,
                max_tn: false,
                warteliste_len: false,
                anmerkungen: false,
                vformat: false,
                start_datum: false,
              },
            },
            density: "compact",
          }}
          sx={{ fontSize: 13 }}
          rows={rows}
          columns={columns}
          slots={{ toolbar: CustomToolbar }}
          slotProps={{
            toolbar: {
              hideFullScreenButton: hideFullScreenButton,
              onFullScreenClick: onFullScreenClick,
            },
          }}
          getCellClassName={(params) => {
            if (params.field === "status") {
              switch (params.value) {
                case "geplant":
                  return "geplant";
                case "angefragt":
                  return "angefragt";
                case "storniert":
                  return "storniert";
                case "geaendert":
                  return "geaendert";
                default:
                  return "";
              }
            }
          }}
        />
      </Box>

      <MUIDialog
        onOpen={openForm}
        onClose={() => setOpenForm(false)}
        content={
          <BuchTerminForm
            initialValues={wTerminToBook}
            onSubmit={handleAddAppt}
            onCloseForm={() => setOpenForm(false)}
            roomsOpt={roomsList}
          />
        }
        disableBackdropClick="true"
        title={
          <Typography variant="h4" fontWeight={600}>
            Neuen Termin planen
          </Typography>
        }
      />
      <AlertSnackbar open={alert} onClose={handleCloseBar} message={alertMsg} severity={alertType}></AlertSnackbar>
    </Box>
  );
};

export default WunschTermine;
