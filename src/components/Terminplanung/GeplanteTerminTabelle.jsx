import { useEffect, useState } from "react";
import { Box, IconButton, Paper } from "@mui/material";
import { DataGrid, GridToolbarContainer, GridToolbar } from "@mui/x-data-grid";
import { grey } from "@mui/material/colors";
import { redAccent } from "../../theme";
import { deDE } from "@mui/x-data-grid/locales";
import { Delete, Edit } from "@mui/icons-material";

const GeplanteTerminTabelle = ({ rows = [], onDeleteTermin, onEditTermin }) => {
  const [termine, setTermine] = useState(rows);

  useEffect(() => {
    setTermine(rows);
  }, [rows]);

  const columns = [
    {
      field: "id",
      headerName: "ID",
      type: "string",
      flex: 0.5,
    },
    {
      field: "wunschtermin_id",
      headerName: "WTermin-ID",
      flex: 0.75,
    },
    { field: "termin_name", headerName: "Terminname", flex: 2 },
    {
      field: "raum",
      headerName: "Raum",
      flex: 0.75,
    },
    {
      field: "rhythmus",
      headerName: "Rhythmus",
      flex: 0.75,
    },
    {
      field: "zeit",
      headerName: "Zeit",
      flex: 1.5,
    },
    {
      field: "Edit",
      sortable: false,
      flex: 0.75,
      renderCell: (e) => {
        return (
          <>
            <IconButton size="small" onClick={() => handleEditTermin(e)}>
              <Edit fontSize="small" />
            </IconButton>
            <IconButton size="small" color="primary" onClick={() => handleDeleteTermin(e)}>
              <Delete fontSize="small" />
            </IconButton>
          </>
        );
      },
    },
  ];

  const handleDeleteTermin = (e) => {
    onDeleteTermin(e.row);
  };

  const handleEditTermin = (e) => {
    onEditTermin(e.row);
  };

  const CustomToolbar = () => {
    return (
      <GridToolbarContainer>
        <GridToolbar csvOptions={{ delimiter: ";" }} printOptions={{ disableToolbarButton: true }} />
      </GridToolbarContainer>
    );
  };

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <Box
        sx={{
          height: "100%",
          overflow: "auto",
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
          "& .MuiDataGrid-cell[data-field='wunschtermin_id']": {
            fontWeight: "bold",
            color: redAccent[500],
          },
        }}
      >
        <DataGrid
          localeText={deDE.components.MuiDataGrid.defaultProps.localeText}
          rows={termine}
          columns={columns}
          slots={{ toolbar: CustomToolbar }}
          getRowId={(row) => row.id}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
            density: "compact",
          }}
          pageSizeOptions={[5, 10, 20]}
          disableRowSelectionOnClick
        />
      </Box>
    </Paper>
  );
};

export default GeplanteTerminTabelle;
