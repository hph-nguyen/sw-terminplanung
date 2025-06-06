/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";

import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Button,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { Formik } from "formik";
import { FormInput, FormSelect } from "../formComponents";
import * as apiService from "../../services/apiService";
import { grey } from "@mui/material/colors";

// const initialData = [{ code: "123456", semestername: "ss24" }];
// const dummySemester = [
//   { value: "ss24", label: "ss24" },
//   { value: "ws23/24", label: "ws23/24" },
// ];

export default function Zugangscode() {
  const [rows, setRows] = useState([]);
  const [isError, setIsError] = useState(false);
  const [semester, setSemester] = useState(sessionStorage.getItem("currentSemester"));
  const [semesterList, setSemesterList] = useState([]);

  const getZugangscode = async () => {
    try {
      const res = await apiService.getZugangscode(semester);
      setRows(res.data);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    const semesters = sessionStorage.getItem("semesterListe")?.split(",");
    if (semesters) {
      const temp = semesters.map((e) => {
        return {
          value: e,
          label: e,
        };
      });
      setSemesterList(temp);
    }
    getZugangscode();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = async (row) => {
    // console.log(row);
    if (row) {
      try {
        const res = await apiService.deleteZugangscode(semester, row);
        if (res.status === 200) {
          getZugangscode();
        } else console.log(res);
      } catch (e) {
        console.log(e);
      }
    }
  };

  const handleSubmit = async (value, { resetForm }) => {
    if (value.semestername && value.code.length === 6) {
      try {
        const res = await apiService.addZugangscode(semester, value);
        if (res.status === 200) {
          getZugangscode();
          console.log(res);
          resetForm();
        } else if (res.status === 409) {
          setIsError(true);
        } else console.log(res);
      } catch (e) {
        console.log(e);
      }
    }
  };

  return (
    <Paper sx={{ padding: 2, overflow: "hidden" }} onClick={() => setIsError(false)}>
      <Typography variant="h4" color="primary" sx={{ mb: 2 }}>
        <strong>Zugangscode für Lehrveranstaltungsterminbuchung</strong>
      </Typography>
      <TableContainer sx={{ maxHeight: "62vh" }} component={Paper}>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{ backgroundColor: grey[300] }}>
                <Typography color="primary">
                  <strong>Zugangscode</strong>
                </Typography>
              </TableCell>
              <TableCell sx={{ backgroundColor: grey[300] }}>
                <Typography color="primary">
                  <strong>Semestername</strong>
                </Typography>
              </TableCell>
              <TableCell sx={{ backgroundColor: grey[300] }}>
                <Typography color="primary">
                  <strong>Löschen</strong>
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{row.code}</TableCell>
                <TableCell>{row.semestername}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleDelete(row)} color="primary">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box my={2} sx={{ width: "50%" }}>
        <Formik onSubmit={handleSubmit} initialValues={{ code: "", semestername: "" }}>
          {({ handleSubmit, resetForm }) => (
            <form
              onSubmit={(event) => {
                handleSubmit(event, { resetForm });
              }}
            >
              <Box
                display={"grid"}
                gap={"15px"}
                gridTemplateColumns="repeat(3, minmax(0, 1fr))"
                sx={{
                  gridColumn: "span 3",
                }}
              >
                <FormInput
                  name={"code"}
                  label={"Neue Code"}
                  maxLength={6}
                  helperText={"Bitte geben Sie den 6-stelligen Code ein"}
                />
                {/* <FormInput name={"semestername"} label={"Semeseter"} /> */}
                <FormSelect
                  name={"semestername"}
                  label="Semester"
                  options={semesterList}
                  size="small"
                  defaultValue={""}
                />
                <Box>
                  <Button type="submit" variant="contained">
                    Hinzufügen
                  </Button>
                </Box>
              </Box>
            </form>
          )}
        </Formik>
      </Box>
      {isError && (
        <Typography variant="h5" color="error">
          <i>Zugangscode für ausgewählten Semester ist vorhanden!</i>
        </Typography>
      )}
    </Paper>
  );
}
