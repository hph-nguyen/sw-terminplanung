#### Termin Datenstruktur

```js
const wunschTermin = [{}];

const terminList = [{}];
```

### MUI DRAWER & DASHBOARD

- https://codesandbox.io/embed/ll9l3s?module=/src/Demo.js&fontsize=12
- https://codesandbox.io/embed/xmcfxl?module=/src/Demo.js&fontsize=12

### Change in Backend:

- Adding to prevent the pop-up login from API via browser.  
  ![alt text](image.png)

```java
.httpBasic()
.and()
.exceptionHandling()
.authenticationEntryPoint((request, response, authException) -> {
response.setContentType("application/json");
response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
response.getWriter().write("{\"error\": \"Unauthorized access\"}");
response.setHeader("WWW-Authenticate", ""); // Removes the browser login popup
})
```

After apply, access directly to API through browser will nomore work.  
![alt text](image-1.png)

### Time Hashmap - Idea for SW

1. Save time slot that being taken from other falkultat --> checkCollisionFromExternAppt
2. Check collision from intern
3. Save time slot that being scheduled for same dozent
4. Check for the conflict through hashmap

Obj = {
anfangszeit:
dauer:
gu:
sh:
}

```java
{
  0: [Obj, Obj],
  1: [ Obj, Obj ],
  2: [ Obj ]
}
```

### Problem

1. How to apply conflict check for raubus and other system that have other format from appt.

### TODO

1. Get method with termin from extern

```java
   public String postSemesternameSwAppt(String semestername, SwApptPost body, Collection<SimpleGrantedAuthority> grantedAuths) {
        if(!rechtFuerSwPlaner(grantedAuths)){
            throw new UnsuccessfulTransactionException("Benutzer habe keine Recht um neunen Termin zu buchen");
        }else{
            String wTerminId = body.getWunschterminId();
            if (wTerminId == null || wTerminId.isEmpty()) {
                throw new UnsuccessfulTransactionException("WunschterminID ist nicht eingegeben");
            }
            String whereStmt = "SEMESTERNAME = '" + semestername + "' AND ID = '" + wTerminId + "'";
            List<WunschterminSw> wtswListe = wunschterminSwDAO.selectAll(whereStmt);

            if (wtswListe == null || wtswListe.isEmpty()) {
                throw new UnsuccessfulTransactionException("Wunschtermin ist nicht gefunden");
            }

            if(body.getRaum() == null || body.getRaum().isEmpty()){
                throw new UnsuccessfulTransactionException("Raum ist nicht eingegben");
            }

//            int newStart = Integer.parseInt(terminService.calcTimeInMinutes(body.getAnfangszeit()));
//            int newDuration = Integer.parseInt(body.getDauer());
//            int newEnd = newStart + newDuration;
//            String newRhythmus = body.getRhythmus();
            String raumKonflikt = "Zeitkonflikt mit bestehendem Termin am gleichen Wochentag in Raum";
            String dozentKonflikt = "Zeitkonflikt: Dozent/-in hat einen anderen Termin im die Zeitinterval";

//            // Get Appt von andere Fak
//            List<Appointment> apptList = this.getAllAppointmentsforRoom(semestername, body.getRaum());
//            // Filter nach wochentag
//            List<Appointment> sameDayAppts = apptList.stream()
//                .filter(a -> a.getWochentag().equals(body.getWochentag()))
//                .collect(Collectors.toList());
//
//            // Loop durch sameDayAppts, um Kollision zwischen Zeitfenster prüfen
//            for (Appointment appt : sameDayAppts) {
//                int apptStart = Integer.parseInt(terminService.calcTimeInMinutes(appt.getAnfangszeit()));
//                int apptEnd = apptStart + Integer.parseInt(appt.getDauer());
//                String gu = appt.getGu();
//
//                if(newRhythmus.equals("W") || newRhythmus.equals("VZ2")){
//                    if (!(newEnd <= apptStart || newStart >= apptEnd)) {
//                        throw new UnsuccessfulTransactionException(raumKonflikt);
//                    }
//                }
//                if(newRhythmus.equals("VZ")){
//                    if (body.getStartDatum() == null || body.getStartDatum().isEmpty() || body.getStartDatum().equals("-")) {
//                        throw new UnsuccessfulTransactionException("Startdatum bei VZ-Termin fehlt");
//                    }
//                    boolean evenWeek = this.terminService.getWeekOfYear(LocalDate.parse(body.getStartDatum())) % 2 == 0; // check for even Week from startDatum
//                    if(gu.contains("G") && evenWeek){
//                        if (!(newEnd <= apptStart || newStart >= apptEnd)) {
//                            throw new UnsuccessfulTransactionException(raumKonflikt);
//                        }
//                    }
//                    if (gu.contains("U") && !evenWeek) {
//                        if (!(newEnd <= apptStart || newStart >= apptEnd)) {
//                            throw new UnsuccessfulTransactionException(raumKonflikt);
//                        }
//                    }
//                }
//                if(newRhythmus.equals("BK")){
//                    if (body.getStartDatum() == null || body.getStartDatum().isEmpty() || body.getStartDatum().equals("-")) {
//                        throw new UnsuccessfulTransactionException("Startdatum bei VZ-Termin fehlt");
//                    }
//                    boolean evenWeek = this.terminService.getWeekOfYear(LocalDate.parse(body.getStartDatum())) % 2 == 0;
//                    if (gu.contains("N")){
//                        if (!(newEnd <= apptStart || newStart >= apptEnd)) {
//                            throw new UnsuccessfulTransactionException(raumKonflikt);
//                        }
//                    }
//                    if(gu.contains("G") && evenWeek){
//                        if (!(newEnd <= apptStart || newStart >= apptEnd)) {
//                            throw new UnsuccessfulTransactionException(raumKonflikt);
//                        }
//                    }
//                    if (gu.contains("U") && !evenWeek) {
//                        if (!(newEnd <= apptStart || newStart >= apptEnd)) {
//                            throw new UnsuccessfulTransactionException(raumKonflikt);
//                        }
//                    }
//                }
//            }
//
//            // GetAllAppt von gleiche Dozent am Wochentag.
//            String benID = wtswListe.get(0).getBenuter_id();
//            whereStmt = "SEMESTERNAME = '" + semestername + "' AND BENUTZER_ID = '" + benID + "' AND WOCHENTAG = '" + body.getWochentag() + "'";
//            List<VeranstaltungSw> vsSwListe = veranstaltungSwDAO.selectAll(whereStmt);
//            for (VeranstaltungSw vs : vsSwListe){
//                int vsStart = Integer.parseInt(terminService.calcTimeInMinutes(vs.getAnfangszeit()));
//                int vsEnd = vsStart + Integer.parseInt(vs.getDauer());
//                String vsRhythmus = vs.getRhythmus();
//                //  Case W & VZ2
//                if(newRhythmus.equals("W") || newRhythmus.equals("VZ2")){
//                    if (!(newEnd <= vsStart || newStart >= vsEnd)) {
//                        throw new UnsuccessfulTransactionException(dozentKonflikt);
//                    }
//                }
//                // Case BK
//                if(newRhythmus.equals("BK")){
//                    if (body.getStartDatum() == null || body.getStartDatum().isEmpty() || body.getStartDatum().equals("-")) {
//                        throw new UnsuccessfulTransactionException("Startdatum bei BK-Termin fehlt");
//                    }
//
//                    if(vsRhythmus.equals("W")){
//                        if (!(newEnd <= vsStart || newStart >= vsEnd)) {
//                            throw new UnsuccessfulTransactionException(dozentKonflikt);
//                        }
//                    }
//                    if(vsRhythmus.equals("VZ")){
//                        boolean newEvenWeek = this.terminService.getWeekOfYear(LocalDate.parse(body.getStartDatum())) % 2 == 0;
//                        boolean existEvenWeek = this.terminService.getWeekOfYear( LocalDate.parse(vs.getStart_datum())) % 2 == 0;
//                        if(newEvenWeek == existEvenWeek){
//                            if (!(newEnd <= vsStart || newStart >= vsEnd)) {
//                                throw new UnsuccessfulTransactionException(dozentKonflikt);
//                            }
//                        }
//                    }
//                }
//                // Case VZ
//                if(newRhythmus.equals("VZ")){
//                    boolean newEvenWeek = this.terminService.getWeekOfYear(LocalDate.parse(body.getStartDatum())) % 2 == 0;
//                    boolean existEvenWeek = this.terminService.getWeekOfYear( LocalDate.parse(vs.getStart_datum())) % 2 == 0;
//                    if(newEvenWeek == existEvenWeek){
//                        if (!(newEnd <= vsStart || newStart >= vsEnd)) {
//                            throw new UnsuccessfulTransactionException(dozentKonflikt);
//                        }
//                    }
//                }
//            }

            if (checkSwApptRaumKonflikt(semestername, body)) {
                throw new UnsuccessfulTransactionException(raumKonflikt);
            }
            if (checkSwApptDozentKonflikt(semestername, body)) {
                throw new UnsuccessfulTransactionException(dozentKonflikt);
            }

            transaction.clearAllStatements();
            String wTerminQuery = "UPDATE SW_WUNSCHTERMINE SET "
                          + "STATUS=" + "'" + body.getStatus() + "'"
                          + "WHERE SEMESTERNAME=" + "'" + semestername + "' "
                          + "AND ID=" + "'" + wTerminId + "'";
            transaction.addStatement(wTerminQuery);

            String id = sucheMoeglicheID(veranstaltungSwDAO.selectAll("SEMESTERNAME = " + "'" + semestername + "'"));
            String apptQuery =  "INSERT INTO SW_VERANSTALTUNG VALUES ("
                + "'" + id + "',"
                + "'" + wTerminId + "',"
                + "'" + body.getTerminName() + "',"
                + "'" + body.getRaum() + "',"
                + "'" + body.getStatus() + "',"
                + "'" + body.getAnfangszeit() + "',"
                + "'" + body.getDauer() + "',"
                + "'" + body.getWochentag() + "',"
                + "'" + body.getRhythmus() + "',"
                + (body.getStartDatum() == null ? "NULL" : "'" + body.getStartDatum() + "'") + ","
                + "'" + body.getSemesterhaelfte()+ "',"
                + "'" + body.getBenutzerId() + "',"
                + "'" + semestername + "')";
            transaction.addStatement(apptQuery);

            boolean erfolg = transaction.startTransaction();
                if (!erfolg)
                {
                   throw new UnsuccessfulTransactionException("Fehler bei Transaction!");
                }
      }
      return "true";
    }

```

```js
/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { Box, Button } from "@mui/material";
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
// import MUIAccordion from "../../shared/MUIAccordion";

const CustomToolbar = ({ hideFullScreenButton = false, onFullScreenClick }) => {
  const handleOpenFullView = () => {
    if (onFullScreenClick) onFullScreenClick();
    window.open("/wunschtermine", "_blank");
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

const WunschTermine = ({
  height = "100%",
  hideFullScreenButton = false,
  // handleBookAppt,
  onFullScreenClick,
  // handleCancleAppt,
  rowData,
}) => {
  const [rows, setRows] = useState(rowData);
  const [openForm, setOpenForm] = useState(false);
  const [terminToEdit, setTerminToEdit] = useState({});

  // Broadcast channel to sync update for multi-Window.
  // So that each change from full screen table will be updated automatically in main window table
  const channel = new BroadcastChannel("wunschtermineChannel");
  useEffect(() => {
    getWunschtermine();
    const handleChannelMessage = (message) => {
      if (message.data === "update") {
        // console.log("Update detected via BroadcastChannel!");
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

  const handleBookAppt = async (e) => {
    const benId = JSON.parse(sessionStorage.getItem("user")).benutzer_id;
    const res = await apiService.putWunschTermin(
      sessionStorage.getItem("currentSemester"),
      { ...e, vformat: e.vformat.toString(), dauer: dauerBerechnung(e.anfangszeit, e.bis) },
      benId
    );
    if (res.status === 200) {
      setOpenForm(false);
      getWunschtermine(benId);
    } else {
      console.log(res);
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

export default WunschTermine;
```

```js
/* eslint-disable no-unused-vars */
import { useEffect } from "react";
import { Box, Button } from "@mui/material";
import { GridToolbar, DataGrid, GridActionsCellItem, gridClasses, GridToolbarContainer } from "@mui/x-data-grid";
import { deDE } from "@mui/x-data-grid/locales";
import { redAccent } from "../../theme";
import { grey } from "@mui/material/colors";
import { EventAvailable, EventBusy, Fullscreen } from "@mui/icons-material";
import { numberToWeekday, formatTimeRange } from "../../services/timeUtils";
import dayjs from "dayjs";

const CustomToolbar = ({ hideFullScreenButton = false, onFullScreenClick }) => {
  const handleOpenFullView = () => {
    if (onFullScreenClick) onFullScreenClick();
    window.open("/wunschtermine", "_blank");
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

const WunschTermine = ({
  height = "100%",
  hideFullScreenButton = false,
  onFullScreenClick,
  rowData = [],
  onCancelClick,
  onEditClick,
}) => {
  // Broadcast channel to listen for updates from other tabs
  useEffect(() => {
    const channel = new BroadcastChannel("wunschtermineChannel");

    const handleChannelMessage = (message) => {
      if (message.data === "update") {
        window.location.reload(); // or notify parent to refresh data
      }
    };

    channel.addEventListener("message", handleChannelMessage);

    return () => {
      channel.removeEventListener("message", handleChannelMessage);
      channel.close();
    };
  }, []);

  const handleCancelClick = (rowData) => async () => {
    await onCancelClick(rowData);

    // Broadcast update to other windows
    const channel = new BroadcastChannel("wunschtermineChannel");
    channel.postMessage("update");
    channel.close();
  };

  const handleEditClick = (rowData) => () => {
    onEditClick?.(rowData);
  };

  const columns = [
    { field: "id", headerName: "ID", flex: 0.25 },
    { field: "dozent", headerName: "Dozent", flex: 0.675 },
    { field: "module", headerName: "Modul", flex: 1.25 },
    { field: "lv_titel", headerName: "LV-Titel", flex: 1 },
    { field: "block_titel", headerName: "BK-Titel (Opt.)", flex: 0.75 },
    { field: "rhythmus", headerName: "Rhythmus", flex: 0.5 },
    { field: "lv_termin", headerName: "LV-Termin", flex: 1 },
    { field: "start_datum", headerName: "1. Tag", flex: 0.5 },
    { field: "raum_wunsch", headerName: "Raumwunsch", flex: 0.5 },
    { field: "co_dozent", headerName: "Co-Dozent", flex: 0.5 },
    { field: "max_tn", headerName: "max. TN-Zahl", flex: 0.5 },
    { field: "warteliste_len", headerName: "Wartelist", flex: 0.5 },
    { field: "anmerkungen", headerName: "Anmerkung", flex: 0.5 },
    { field: "vformat", headerName: "Virtuelles Format", flex: 0.5 },
    { field: "status", headerName: "Status", flex: 0.5 },
    {
      field: "actions",
      type: "actions",
      headerName: "Aktion",
      flex: 0.75,
      getActions: (e) => [
        <GridActionsCellItem
          key="edit"
          icon={<EventAvailable />}
          label="Edit"
          onClick={handleEditClick(e.row.rawData)}
          disabled={e.row.rawData.status === "storniert"}
        />,
        <GridActionsCellItem
          key="cancel"
          icon={<EventBusy />}
          label="Stornieren"
          onClick={handleCancelClick(e.row.rawData)}
          disabled={e.row.rawData.status === "storniert"}
        />,
      ],
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
          rows={rowData}
          columns={columns}
          slots={{ toolbar: CustomToolbar }}
          slotProps={{
            toolbar: {
              hideFullScreenButton,
              onFullScreenClick,
            },
          }}
          getCellClassName={(params) => {
            if (params.field === "status") return params.value;
            return "";
          }}
          sx={{ fontSize: 13 }}
        />
      </Box>
    </Box>
  );
};

export default WunschTermine;
```
