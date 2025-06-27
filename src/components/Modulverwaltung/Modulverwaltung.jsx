/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TablePagination from "@mui/material/TablePagination";
import Paper from "@mui/material/Paper";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";
import KeyboardDoubleArrowUpIcon from "@mui/icons-material/KeyboardDoubleArrowUp";
import { TextField, Tooltip, Typography } from "@mui/material";
import { Add, ArrowDownward, ArrowUpward, Close, Delete, Edit, InfoOutlined, Save } from "@mui/icons-material";
import { redAccent } from "../../theme";
import * as apiService from "../../services/apiService";
import { grey } from "@mui/material/colors";
import MUIDialog from "../../shared/MUIDialog";
import { AddNewLv, AddNewModul } from "./ModulVerwaltungsFormen";
import ConfirmDialog from "../../shared/ConfirmDialog";

/**
 * TABLE ROWS DEFINITION
 */
function Row(props) {
  const { row, openAll, onModulSave, onLvSave, onModulDelete, onLvDelete, onAddNewLv } = props;
  const [open, setOpen] = useState(false);
  const [isEditingModul, setIsEditingModul] = useState(false);
  const [editedModul, setEditedModul] = useState(row);
  const [isEditingLv, setIsEditingLv] = useState(false);
  const [editedLv, setEditedLv] = useState({});

  const [selectedModul, setSelectedModul] = useState({});
  const [openAddNewLv, setOpenAddNewLv] = useState(false);

  useEffect(() => {
    setOpen(openAll);
  }, [openAll]);

  const handleEditModulClick = () => {
    setIsEditingModul(true);
  };

  const handleModulInputChange = (e, field) => {
    setEditedModul({ ...editedModul, [field]: e.target.value });
  };

  const handleSaveModulClick = () => {
    onModulSave(editedModul);
    setIsEditingModul(false);
  };

  const handleEditLvClick = (lv) => {
    setIsEditingLv(lv.id);
    setEditedLv(lv);
  };

  const handleLvInputChange = (e, field) => {
    setEditedLv({ ...editedLv, [field]: e.target.value });
  };

  const handleSaveLvClick = () => {
    onLvSave(editedLv);
    setIsEditingLv(false);
  };

  const handleCancleSave = () => {
    setIsEditingModul(false);
  };

  const handleCancleLvSave = () => {
    setIsEditingLv(false);
  };

  const handleOpenAddNewLv = (modul) => {
    setSelectedModul(modul);
    setOpenAddNewLv(true);
  };

  const handleAddNewLv = async (lvData) => {
    await onAddNewLv(lvData);
    setOpenAddNewLv(false);
  };

  return (
    <>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell component="th" scope="row" sx={{ width: "25%" }}>
          <IconButton size="small" sx={{ mr: 1 }} onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
          <strong>{row.modul_id}</strong>
        </TableCell>
        <TableCell sx={{ width: "50%" }}>
          {isEditingModul ? (
            <TextField
              type="text"
              value={editedModul.name}
              onChange={(e) => handleModulInputChange(e, "name")}
              size="small"
              sx={{ display: "flex" }}
            />
          ) : (
            <strong>{row.name}</strong>
          )}
        </TableCell>
        <TableCell sx={{ width: "25%" }} align="center">
          {isEditingModul ? (
            <>
              <IconButton color="info" onClick={handleSaveModulClick}>
                <Save fontSize="small" />
              </IconButton>
              <IconButton color="dark" onClick={handleCancleSave}>
                <Close fontSize="small" />
              </IconButton>
            </>
          ) : (
            <>
              <IconButton color="dark" onClick={handleEditModulClick}>
                <Edit fontSize="small" />
              </IconButton>
              <IconButton color="primary" onClick={() => onModulDelete({ modul_id: row.modul_id, name: row.name })}>
                <Delete fontSize="small" />
              </IconButton>
            </>
          )}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ padding: 0 }} colSpan={3} sx={{ backgroundColor: grey[300] }}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1.5 }}>
              <TableContainer component={Paper} elevation={0}>
                <Table size="small" sx={{ tableLayout: "fixed", width: "100%" }}>
                  <TableHead sx={{ backgroundColor: redAccent[200], "& th": { color: "white" } }}>
                    <TableRow>
                      <TableCell sx={{ width: "25%" }}>
                        <strong>LV-ID</strong>
                      </TableCell>
                      <TableCell sx={{ width: "50%" }}>
                        <strong>LV-Titel</strong>
                      </TableCell>
                      <TableCell sx={{ width: "25%" }} align="center">
                        <Tooltip arrow title="Neue Lehrveranstaltung hinzufügen">
                          <IconButton
                            sx={{ color: "white" }}
                            onClick={() => handleOpenAddNewLv({ modul_id: row.modul_id, modul_name: row.name })}
                          >
                            <Add />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {row.lv.length > 0 ? (
                      row.lv.map((lvRow) => (
                        <TableRow key={lvRow.id}>
                          <TableCell sx={{ width: "25%" }} component="th" scope="row">
                            {lvRow.id}
                          </TableCell>
                          <TableCell sx={{ width: "50%" }}>
                            {isEditingLv === lvRow.id ? (
                              <TextField
                                type="text"
                                value={editedLv.name}
                                onChange={(e) => handleLvInputChange(e, "name")}
                                size="small"
                                sx={{ display: "flex" }}
                              />
                            ) : (
                              lvRow.name
                            )}
                          </TableCell>
                          <TableCell sx={{ width: "25%" }} align="center">
                            {isEditingLv === lvRow.id ? (
                              <>
                                <IconButton color="info" onClick={handleSaveLvClick} size="small">
                                  <Save />
                                </IconButton>
                                <IconButton color="dark" onClick={handleCancleLvSave}>
                                  <Close fontSize="small" />
                                </IconButton>
                              </>
                            ) : (
                              <>
                                <IconButton color="dark" onClick={() => handleEditLvClick(lvRow)}>
                                  <Edit fontSize="small" />
                                </IconButton>
                                <IconButton color="primary" onClick={() => onLvDelete(lvRow.rawData)}>
                                  <Delete fontSize="small" />
                                </IconButton>
                              </>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3}>
                          <Typography sx={{ padding: 0.5 }}>Keine Lehrveranstaltung</Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
      <MUIDialog
        onOpen={openAddNewLv}
        onClose={() => setOpenAddNewLv(false)}
        title={"Lehrveranstaltung hinzufügen"}
        content={
          <AddNewLv onSubmit={handleAddNewLv} modul_id={selectedModul.modul_id} modul_name={selectedModul.modul_name} />
        }
      ></MUIDialog>
    </>
  );
}

Row.propTypes = {
  row: PropTypes.shape({
    modul_id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    lv: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
      })
    ).isRequired,
  }).isRequired,
  openAll: PropTypes.bool.isRequired,
  onModulSave: PropTypes.func.isRequired,
  onLvSave: PropTypes.func.isRequired,
};

/**
 * TABLE DEFINITION
 */
function Modulverwaltung() {
  const [openAll, setOpenAll] = useState(false);
  const [rows, setRows] = useState([]);
  const [semester, setSemester] = useState(sessionStorage.getItem("currentSemester"));
  const [sortConfig, setSortConfig] = useState({ key: "modul_id", direction: "ascending" });

  const [confirmDeleteModul, setConfirmDeleteModul] = useState(false);
  const [modulToDelete, setModulToDelete] = useState([]);

  const [confirmDeleteLv, setConfirmDeleteLv] = useState(false);
  const [lvToDelete, setLvToDelete] = useState([]);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(100);

  const [openAddNewModul, setOpenAddNewModul] = useState(false);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenAddNewModul = () => {
    setOpenAddNewModul(true);
  };

  const handleAddNewModul = async (e) => {
    const res = await apiService.postNewModul(semester, [e]);
    if (res.status === 200) {
      // console.log(res);
      fetchTableData();
    } else {
      console.log(res);
    }
    setOpenAddNewModul(false);
  };

  const handleConfirmDeleteModul = (modul) => {
    setConfirmDeleteModul(true);
    setModulToDelete([modul]);
  };

  const handleDeleteModul = async () => {
    try {
      const res = await apiService.deleteModul(semester, modulToDelete);
      if (res.status === 200) {
        fetchTableData();
        setModulToDelete([]);
      } else {
        console.log("Error Modul löschen:", res);
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const handleConfirmDeleteLv = (lv) => {
    setConfirmDeleteLv(true);
    setLvToDelete([lv]);
  };

  const handleDeleteLv = async () => {
    try {
      const res = await apiService.deleteLv(semester, lvToDelete);
      if (res.status === 200) {
        fetchTableData();
        setLvToDelete([]);
      } else {
        console.log("Error LV löschen:", res);
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const handleAddNewLv = async (newLv) => {
    const res = await apiService.postNewLv(semester, [newLv]);
    if (res.status === 200) {
      fetchTableData();
    } else {
      console.log(res);
    }
  };

  const sortedRows = [...rows].sort((a, b) => {
    const valueA = a[sortConfig.key];
    const valueB = b[sortConfig.key];

    const isNumeric = (str) => /^\d+(\.\d+)*$/.test(str);
    const parseValue = (str) => str.split(".").map(Number);

    const isValueANumeric = isNumeric(valueA);
    const isValueBNumeric = isNumeric(valueB);

    if (isValueANumeric && isValueBNumeric) {
      const partsA = parseValue(valueA);
      const partsB = parseValue(valueB);

      for (let i = 0; i < Math.max(partsA.length, partsB.length); i++) {
        const numA = partsA[i] ?? 0;
        const numB = partsB[i] ?? 0;

        if (numA !== numB) {
          return sortConfig.direction === "ascending" ? numA - numB : numB - numA;
        }
      }
      return 0;
    }

    return sortConfig.direction === "ascending"
      ? valueA.localeCompare(valueB, undefined, { numeric: true })
      : valueB.localeCompare(valueA, undefined, { numeric: true });
  });

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const getModulListe = async () => {
    try {
      const res = await apiService.getModulListe(semester);
      return res.data;
    } catch (e) {
      console.log(e);
    }
  };

  const getLvListe = async () => {
    try {
      const res = await apiService.getLvListe(semester);
      return res.data;
    } catch (e) {
      console.error("Error fetching LV list:", e);
      return [];
    }
  };

  const fetchTableData = async () => {
    try {
      const modulListe = await getModulListe();
      const lvListe = await getLvListe();
      const moduleMap = {};

      for (const modul of modulListe) {
        moduleMap[modul.modul_id] = {
          modul_id: modul.modul_id,
          name: modul.name,
          lv: [],
        };
      }

      for (const lv of lvListe) {
        if (moduleMap[lv.modul_id]) {
          moduleMap[lv.modul_id].lv.push({ id: lv.id, name: lv.name, rawData: { ...lv } });
        }
      }
      setRows(Object.values(moduleMap));
      return Object.values(moduleMap);
    } catch (error) {
      console.log("Error fetching data:", error);
      return [];
    }
  };

  useEffect(() => {
    fetchTableData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleModulSave = async (editedModul) => {
    const res = await apiService.putEditModul(semester, { modul_id: editedModul.modul_id, name: editedModul.name });
    if (res.status === 200) {
      fetchTableData();
    } else {
      console.log(res);
    }
  };

  const handleLvSave = async (editedLv) => {
    const res = await apiService.putEditLv(semester, { ...editedLv.rawData, name: editedLv.name });
    if (res.status === 200) {
      fetchTableData();
    } else {
      console.log(res);
    }
  };

  return (
    <>
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer component={Paper} sx={{ maxHeight: "80vh" }}>
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: "25%", backgroundColor: redAccent[500] }}>
                  <Typography color="white">
                    <IconButton size="small" onClick={() => setOpenAll(!openAll)} sx={{ color: "white", mr: 1 }}>
                      {openAll ? <KeyboardDoubleArrowUpIcon /> : <KeyboardDoubleArrowDownIcon />}
                    </IconButton>
                    <strong onClick={() => requestSort("modul_id")} style={{ cursor: "pointer" }}>
                      Modul-ID
                      {sortConfig.key === "modul_id" ? (
                        sortConfig.direction === "ascending" ? (
                          <ArrowUpward fontSize="small" sx={{ color: "white" }} />
                        ) : (
                          <ArrowDownward fontSize="small" sx={{ color: "white" }} />
                        )
                      ) : (
                        ""
                      )}
                    </strong>
                  </Typography>
                </TableCell>
                <TableCell sx={{ width: "50%", backgroundColor: redAccent[500] }}>
                  <Typography color="white">
                    <strong onClick={() => requestSort("name")} style={{ cursor: "pointer" }}>
                      Titel
                      {sortConfig.key === "name" ? (
                        sortConfig.direction === "ascending" ? (
                          <ArrowUpward fontSize="small" sx={{ color: "white" }} />
                        ) : (
                          <ArrowDownward fontSize="small" sx={{ color: "white" }} />
                        )
                      ) : (
                        ""
                      )}
                    </strong>
                  </Typography>
                </TableCell>
                <TableCell sx={{ width: "25%", backgroundColor: redAccent[500] }} align="center">
                  <Tooltip arrow title="Neues Modul hinzufügen">
                    <IconButton sx={{ color: "white" }} onClick={handleOpenAddNewModul}>
                      <Add />
                    </IconButton>
                  </Tooltip>
                  <Tooltip arrow title="Bei Änderung der Modul-ID bitte das Modul löschen und erneut hinzufügen">
                    <IconButton sx={{ color: "white", position: "absolute", top: 2, right: 8 }}>
                      <InfoOutlined />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedRows.length > 0 ? (
                sortedRows
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <Row
                      key={row.modul_id}
                      row={row}
                      openAll={openAll}
                      onModulSave={handleModulSave}
                      onLvSave={handleLvSave}
                      onModulDelete={handleConfirmDeleteModul}
                      onLvDelete={handleConfirmDeleteLv}
                      onAddNewLv={handleAddNewLv}
                    />
                  ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    <Typography>
                      <strong>Keine Einträge</strong>
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <MUIDialog
        onOpen={openAddNewModul}
        title={"Modul Hinzufügen"}
        onClose={() => setOpenAddNewModul(false)}
        content={<AddNewModul onSubmit={handleAddNewModul} />}
      />
      <ConfirmDialog
        open={confirmDeleteModul}
        msg="Sind Sie sicher, dass Sie diese Modul löschen möchten?"
        onConfirm={() => {
          handleDeleteModul(), setConfirmDeleteModul(false);
        }}
        onDecline={() => setConfirmDeleteModul(false)}
        disableBackdropClick="true"
      />
      <ConfirmDialog
        open={confirmDeleteLv}
        msg="Sind Sie sicher, dass Sie diese Lehrveranstaltung löschen möchten?"
        onConfirm={() => {
          handleDeleteLv(), setConfirmDeleteLv(false);
        }}
        onDecline={() => setConfirmDeleteLv(false)}
        disableBackdropClick="true"
      />
    </>
  );
}

export default Modulverwaltung;
