import { Box, Button, TextField, Typography, useMediaQuery } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import { FormDatePicker, FormInput, FormSelect } from "../formComponents";
import { LV_RHYTHMUS, TIME_PICKER_BIS, TIME_PICKER_VON, VIRTUELLES_FORMAT, WEEKDAY } from "../../constants";
import { dauerBerechnung, formatDauerZuEndzeit } from "../../services/timeUtils";
import MUIAccordion from "../../shared/MUIAccordion";

const BuchTerminForm = ({ onSubmit, initialValues, onCloseForm, roomsOpt }) => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  initialValues.id = "0"; // Default als 0 setzen

  return (
    <Box m={"10px"}>
      <Box sx={{ mb: 3 }}>
        {initialValues.wunschtermin && (
          <MUIAccordion
            disableGutters={true}
            header={
              <Typography variant="h5" fontWeight={600}>
                Wunschtermin-Info
              </Typography>
            }
            elevation="2"
            defaultExpanded={false}
          >
            {Object.entries(initialValues.wunschtermin).map(([key, value]) => (
              <Typography key={key} variant="body1">
                <strong>{key}:</strong> {String(value)}
              </Typography>
            ))}
          </MUIAccordion>
        )}
      </Box>
      <Formik onSubmit={onSubmit} initialValues={initialValues} validationSchema={checkoutSchema}>
        {({ handleSubmit, handleReset, handleChange, setFieldValue, values }) => (
          <form onSubmit={handleSubmit} onReset={handleReset}>
            <Box
              display={"grid"}
              gap={"15px"}
              gridTemplateColumns={"repeat(2, minmax(0,1fr))"}
              sx={{ "& > div": { gridColumn: isNonMobile ? undefined : "span 2" } }}
            >
              <FormInput name={"termin_name"} label="Terminname" span={2} />
              <FormSelect
                span="2"
                name="raum"
                label="Raum"
                defaultValue={initialValues.raum}
                options={roomsOpt}
                onChange={handleChange}
              />
              {initialValues.wunschtermin && (
                <>
                  <TextField
                    defaultValue={`${initialValues.wunschtermin.modul_id} ${initialValues.wunschtermin.modul_titel}`}
                    label="Modul"
                    disabled
                    size="small"
                  />
                  <TextField
                    defaultValue={
                      initialValues.wunschtermin.lv_titel
                        ? `${initialValues.wunschtermin.lv_titel}`
                        : `${initialValues.wunschtermin.lv_frei_titel}`
                    }
                    label="LV"
                    disabled
                    size="small"
                  />
                </>
              )}
              <FormSelect
                name="anfangszeit"
                label="Von"
                options={TIME_PICKER_VON}
                defaultValue={initialValues.anfangszeit}
                onChange={(e) => {
                  handleChange(e);
                  if (values.bis) setFieldValue("dauer", dauerBerechnung(e.target.value, values.bis));
                }}
              />
              <FormSelect
                name="bis"
                label="Bis"
                options={TIME_PICKER_BIS}
                defaultValue={
                  initialValues.anfangszeit ? formatDauerZuEndzeit(initialValues.anfangszeit, initialValues.dauer) : ""
                }
                onChange={(e) => {
                  handleChange(e);
                  setFieldValue("dauer", dauerBerechnung(values.anfangszeit, e.target.value));
                }}
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
                span={2}
              />
              <Button type="submit" color="primary" variant="contained">
                Planen
              </Button>
              <Button color="primary" variant="outlined" onClick={onCloseForm}>
                Abbrechen
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default BuchTerminForm;

// const initVal = {
//   id: "0",
//   termin_name: "",
//   wunschtermin_id: "",
//   raum: "",
//   anfangszeit: "08:00",
//   dauer: "",
//   status: "",
//   wochentag: "0",
//   rhythmus: "W",
//   start_datum: "",
//   semesterhaelfte: "0",
//   benutzer_id: "",
//   wunschtermin: {},
// };

const checkoutSchema = yup.object().shape({
  termin_name: yup.string().required("Terminname kann nicht leer sein"),
  raum: yup.string().required("Bitte auswählen"),
  anfangszeit: yup.string().required("Bitte auswählen"),
  bis: yup.string().required("Bitte auswählen"),
});
