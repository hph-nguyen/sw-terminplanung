import { Box, Button, TextField, useMediaQuery } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import { FormDatePicker, FormInput, FormSelect } from "../formComponents";
import { LV_RHYTHMUS, TIME_PICKER_BIS, TIME_PICKER_VON, VIRTUELLES_FORMAT, WEEKDAY } from "../../constants";
import { formatDauerZuEndzeit } from "../../services/timeUtils";

const BuchTerminForm = ({ onSubmit, initialValues = initVal }) => {
  const isNonMobile = useMediaQuery("(min-width:600px)");

  return (
    <Box m={"10px"}>
      <Formik onSubmit={onSubmit} initialValues={initialValues} validationSchema={checkoutSchema}>
        {({ handleSubmit, handleReset, handleChange }) => (
          <form onSubmit={handleSubmit} onReset={handleReset}>
            <Box
              display={"grid"}
              gap={"15px"}
              gridTemplateColumns={"repeat(2, minmax(0,1fr))"}
              sx={{ "& > div": { gridColumn: isNonMobile ? undefined : "span 2" } }}
            >
              <TextField
                defaultValue={`${initialValues.modul_id} ${initialValues.modul_titel}`}
                label="Modul"
                disabled
                size="small"
              />
              <FormInput name={"termin_name"} label="Terminname" disabled />

              <FormSelect
                name="anfangszeit"
                label="Von"
                options={TIME_PICKER_VON}
                defaultValue={initialValues.anfangszeit}
              />
              <FormSelect
                name="bis"
                label="Bis"
                options={TIME_PICKER_BIS}
                defaultValue={formatDauerZuEndzeit(initialValues.anfangszeit, initialValues.dauer)}
              />
              <FormSelect label="Wochentag" name="wochentag" options={WEEKDAY} defaultValue={initialValues.wochentag} />
              {initialValues.rhythmus === "BK" ? (
                <FormDatePicker name="start_datum" label="Datum" />
              ) : (
                <FormDatePicker name="start_datum" label="1.Tag (Opt.)" />
              )}
              <FormSelect
                span="2"
                name="rhythmus"
                label="LV-Rhythmus"
                defaultValue={initialValues.rhythmus}
                options={LV_RHYTHMUS}
                onChange={handleChange}
              />
              <FormSelect
                name={"vformat"}
                label="Virtuelles Format"
                options={VIRTUELLES_FORMAT}
                onChange={handleChange}
                multiple={true}
                defaultValue={initialValues.vformat}
                helperText={"Mehrfach wählbar"}
              />
              <Button type="submit" color="primary" variant="contained">
                Änderung speichern
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default BuchTerminForm;

const initVal = {
  id: "0",
  termin_name: "",
  wunschtermin_id: "",
  raum: "",
  anfangszeit: "08:00",
  dauer: "",
  status: "",
  wochentag: "0",
  rhythmus: "W",
  start_datum: "",
  semesterhaelfte: "0",
  benutzer_id: "",
};

const checkoutSchema = yup.object().shape({});
