/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { Box, Button, IconButton, Paper } from "@mui/material";
import { GridToolbar, DataGrid, GridActionsCellItem, gridClasses, GridToolbarContainer } from "@mui/x-data-grid";

import { deDE } from "@mui/x-data-grid/locales";
import { redAccent } from "../../theme";
// import MUIDialog from "../shared/MUIDialog";
// import TerminChangeForm from "./TerminChangeForm";
import * as apiService from "../../services/apiService";
// import ConfirmDialog from "./shared/ConfirmDialog";
import { numberToWeekday, formatTimeRange, dauerBerechnung } from "../../services/timeUtils";
import dayjs from "dayjs";
import { grey } from "@mui/material/colors";
import { EventAvailable, EventBusy } from "@mui/icons-material";
import { Fullscreen } from "@mui/icons-material";
import MUIAccordion from "../../shared/MUIAccordion";

const CustomToolbar = ({ hideFullScreenButton = false, onFullScreenClick }) => {
  const handleOpenFullView = () => {
    if (onFullScreenClick) onFullScreenClick();
    window.open("/gebuchte-termine", "_blank");
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

const GebuchtTermine = ({ height = "100%", hideFullScreenButton = false, handleBookAppt, onFullScreenClick }) => {
  const [rows, setRows] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [terminToEdit, setTerminToEdit] = useState({});

  // Broadcast channel to sync update for multi-Window.
  // So that each change from full screen table will be updated automatically in main window table
  const channel = new BroadcastChannel("gebuchteTermineChannel");
  useEffect(() => {
    getGebuchteTermine();
    const handleChannelMessage = (message) => {
      if (message.data === "update") {
        // console.log("Update detected via BroadcastChannel!");
        getGebuchteTermine();
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

  const handleEditClick = (e) => () => {
    if (!e?.row?.rawData) return "";

    const rawData = e.row.rawData;

    // Replace null values with empty strings
    const sanitizedData = Object.fromEntries(
      Object.entries(rawData).map(([key, value]) => [key, value === null ? "" : value])
    );
    sanitizedData.vformat = sanitizedData.vformat ? sanitizedData.vformat.split(",") : [];
    sanitizedData.status = "geaendert";
    setTerminToEdit(sanitizedData);
    setOpenForm(true);
  };

  const handleBook = async (e) => {
    const benId = JSON.parse(sessionStorage.getItem("user")).benutzer_id;
    const res = await apiService.putTermin(
      sessionStorage.getItem("currentSemester"),
      { ...e, vformat: e.vformat.toString(), dauer: dauerBerechnung(e.anfangszeit, e.bis) },
      benId
    );
    if (res.status === 200) {
      setOpenForm(false);
      getGebuchteTermine(benId);
    } else {
      console.log(res);
    }
  };

  const getGebuchteTermine = async () => {
    try {
      const res = await apiService.getAllGebuchteTermine(sessionStorage.getItem("currentSemester"));
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
        const res = await apiService.putTermin(sessionStorage.getItem("currentSemester"), temp, benutzerId);
        if (res.status === 200) {
          getGebuchteTermine();
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
            onClick={handleEditClick(e)}
            color="primary"
            disabled={e.row.rawData.status === "storniert" ? true : false}
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
            backgroundColor: "#b9d5ff91",
          },
          [`.${gridClasses.cell}.storniert`]: {
            backgroundColor: "#f6685e75",
          },
          [`.${gridClasses.cell}.angefragt`]: {
            backgroundColor: "#6fbf7391",
          },
          [`.${gridClasses.cell}.geaendert`]: {
            backgroundColor: "#ffd32c75",
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

      {/* <MUIDialog
          onOpen={openForm}
          onClose={() => setOpenForm(false)}
          content={<BuchTerminForm initialValues={terminToEdit} onSubmit={handleBook} />}
          disableBackdropClick="true"
          title={"Gebuchten Termin ändern"}
        /> */}
    </Box>
  );
};

export default GebuchtTermine;
