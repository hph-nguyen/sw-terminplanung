import { useEffect, useState } from "react";
import * as apiService from "../../services/apiService";
import { Box, Button, IconButton, Paper, Tooltip } from "@mui/material";
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

const Benutzerverwaltung = () => {
  const [benutzer, setBenutzer] = useState([]);
  useEffect(() => {
    getAllBenutzer();
  }, []);

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
      renderCell: () => {
        return (
          <IconButton onClick={handleEditClick} color="primary">
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
        <Button size="small" onClick={handleAddPerson}>
          <Tooltip title="Neue Benutzer hinzufügen">
            <PersonAdd />
          </Tooltip>
        </Button>
      </GridToolbarContainer>
    );
  };

  const handleAddPerson = () => {};
  const handleEditClick = () => {};

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
    </Paper>
  );
};

export default Benutzerverwaltung;
