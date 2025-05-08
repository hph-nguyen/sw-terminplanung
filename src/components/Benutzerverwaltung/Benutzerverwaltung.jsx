import { useEffect, useState } from "react";
import * as apiService from "../../services/apiService";
import { Alert, AlertTitle, Box, Button, IconButton, Paper, Snackbar, Tooltip } from "@mui/material";
import {
  DataGrid,
  GridToolbarFilterButton,
  GridToolbarColumnsButton,
  GridToolbarDensitySelector,
  GridToolbarContainer,
} from "@mui/x-data-grid";
import { grey } from "@mui/material/colors";
import { redAccent } from "../../theme";
import { deDE } from "@mui/x-data-grid/locales";
import { Edit, PersonAdd } from "@mui/icons-material";
import MUIDialog from "../../shared/MUIDialog";
import AddPerson from "./AddPerson";
import EditPerson from "./EditPerson";

const Benutzerverwaltung = () => {
  const [benutzer, setBenutzer] = useState([]);
  const [alertMsg, setAlertMsg] = useState("");
  const [alert, setAlert] = useState(false);
  const [alertType, setAlertType] = useState(false);

  useEffect(() => {
    getAllBenutzer();
  }, []);

  const [openAddPerson, setOpenAddPerson] = useState(false);
  const [openEditPerson, setOpenEditPerson] = useState(false);

  const [selectedDozent, setSelectedDozent] = useState({
    name: "",
    vorname: "",
    namenszusatz: "",
    login: "",
    fakultaet: "sw",
    lehrpersonentyp: "PF",
    zuLoeschen: "0",
  });

  const columns = [
    {
      field: "login",
      headerName: "Loginname",
      type: "string",
      flex: 1,
    },
    { field: "name", headerName: "Name", flex: 1 },
    {
      field: "vorname",
      headerName: "Vorname",
      flex: 1,
    },
    {
      field: "namenszusatz",
      headerName: "Namenszusatz",
      flex: 1,
    },

    {
      field: "lehrpersonentyp",
      headerName: "Lehrpersonen Typ",
      type: "string",
      flex: 1,
    },
    {
      field: "Edit",
      sortable: false,
      flex: 1,
      renderCell: (e) => {
        return (
          <IconButton onClick={() => handleEditClick(e)} color="primary">
            <Edit />
          </IconButton>
        );
      },
    },
  ];

  const CustomToolbar = () => {
    return (
      <GridToolbarContainer>
        <GridToolbarColumnsButton />
        <GridToolbarFilterButton />
        <GridToolbarDensitySelector />
        <Button size="small" onClick={handleAddClick}>
          <Tooltip title="Neue Benutzer hinzufügen">
            <PersonAdd />
          </Tooltip>
        </Button>
      </GridToolbarContainer>
    );
  };

  const handleAddClick = () => {
    setOpenAddPerson(true);
  };
  const handleEditClick = (e) => {
    setSelectedDozent(e.row);
    console.log(e.row);
    setOpenEditPerson(true);
  };

  //close SnackBar
  const handleCloseBar = () => {
    setAlert(false);
    setTimeout(() => {
      setAlertMsg("");
      setAlertType(false);
    }, 500);
  };

  const addBenutzer = async (values) => {
    const result = await apiService.addDozent(sessionStorage.getItem("currentSemester"), [values]);

    // Das Ergebnis basierend auf dem Status behandeln
    //Erfolgsfall
    if (result.status === 200) {
      setAlert(true);
      setAlertMsg("Erfolgreich hinzugefügt");
      setAlertType("success");

      //getDozent-Funktion wird aufgerufen, um wahrscheinlich aktualisierte Dozentenliste abzurufen.
      getAllBenutzer();

      //Bei Konflikten
    } else if (result.response.status === 409) {
      setAlert(true);
      setAlertMsg(result.response.data);

      //Andere Fälle
    } else {
      setAlert(true);
      setAlertMsg(result.response.data);
    }
    setOpenAddPerson(false);
  };

  const editBenutzer = async (values) => {
    console.log(values);
    console.log(selectedDozent.login);
    try {
      const result = await apiService.editDozent(
        sessionStorage.getItem("currentSemester"),
        [values],
        //Verwendung des Loginnamens des ausgewähltem Dozenten
        selectedDozent ? selectedDozent.login : ""
      );

      // Das Ergebnis basierend auf dem Status behandeln
      if (result.status === 200) {
        setAlert(true);
        setAlertType("success");
        setAlertMsg("Dozent/in wurde erfolgreich geändert");
        getAllBenutzer();
      } else {
        setAlert(true);
        setAlertMsg(result.response.data);
      }
    } catch (error) {
      console.log(error);
    }
    setOpenEditPerson(false);
  };

  const getAllBenutzer = async () => {
    try {
      const res = await apiService.getAllBenutzer(sessionStorage.getItem("currentSemester"));
      if (res?.status === 200 && res.data) {
        const swBen = res.data.filter((ben) => ben.fakultaet === "sw");
        setBenutzer(swBen);
      }
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <Box
        sx={{
          "& .MuiDataGrid-root": { border: "none" },
          "& .MuiDataGrid-columnHeader": {
            backgroundColor: grey[300],
            color: redAccent[500],
          },
          "& .MuiDataGrid-columnHeaderTitle": {
            fontWeight: "700",
          },
          "& .MuiDataGrid-cell[data-field='id']": {
            fontWeight: "bold",
            color: redAccent[500],
          },
        }}
      >
        <DataGrid
          localeText={deDE.components.MuiDataGrid.defaultProps.localeText}
          rows={benutzer}
          columns={columns}
          slots={{ toolbar: CustomToolbar }}
          getRowId={(row) => row.login}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5,
              },
            },
          }}
          pageSizeOptions={[5]}
          disableRowSelectionOnClick
        />
      </Box>

      <MUIDialog
        onOpen={openAddPerson}
        onClose={() => setOpenAddPerson(false)}
        title={"Dozent/-in hinzufügen"}
        content={<AddPerson onSubmit={addBenutzer} />}
      ></MUIDialog>

      <MUIDialog
        onOpen={openEditPerson}
        onClose={() => setOpenEditPerson(false)}
        title={"Dozent/-in ändern"}
        content={<EditPerson onSubmit={editBenutzer} initialValues={selectedDozent} />}
      ></MUIDialog>

      <Snackbar
        open={alert}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        autoHideDuration={5000}
        onClose={handleCloseBar}
      >
        <Alert onClose={handleCloseBar} severity={alertType || "error"} sx={{ width: "100%" }}>
          <AlertTitle>
            <strong>{alertMsg}</strong>
          </AlertTitle>
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default Benutzerverwaltung;
