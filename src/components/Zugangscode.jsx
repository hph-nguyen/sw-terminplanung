/* eslint-disable no-unused-vars */
import { useState } from "react";

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
import { FormInput } from "./formComponents";

const initialData = [{ code: "123456", semestername: "ss24" }];

export default function Zugangscode() {
  const [rows, setRows] = useState(initialData);

  const handleDelete = (row) => {
    console.log(row);
  };

  const handleSubmit = (value) => {
    if (value.semestername && value.code.length === 6) {
      console.log(value);
    }
  };

  return (
    <Paper sx={{ padding: 2, overflow: "hidden" }}>
      <TableContainer sx={{ maxHeight: "80vh" }}>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography color="primary">
                  <strong>Zugangscode</strong>
                </Typography>
              </TableCell>
              <TableCell>
                <Typography color="primary">
                  <strong>Semestername</strong>
                </Typography>
              </TableCell>
              <TableCell>
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
                  <IconButton onClick={() => handleDelete(row)}>
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
          {({ handleSubmit }) => (
            <form onSubmit={handleSubmit}>
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
                <FormInput name={"semestername"} label={"Semeseter"} />
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
    </Paper>
  );
}
