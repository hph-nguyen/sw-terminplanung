import { Box, Button } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";

import { FormInput, FormSelect } from "../../components/formComponents";
import { personaltyp, zuloeschen } from "../../constants";

const EditPerson = ({ onSubmit, initialValues }) => {
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const convertSpecialCharacters = (name) => {
    return name
      .replace(/Ö/g, "oe")
      .replace(/Ä/g, "ae")
      .replace(/Ü/g, "ue")
      .replace(/ö/g, "oe")
      .replace(/ä/g, "ae")
      .replace(/ü/g, "ue");
  };

  const editLogin = (name, vorname) => {
    const modifiedName = convertSpecialCharacters(name);
    const modifiedVorname = convertSpecialCharacters(vorname);

    const firstTwo = modifiedVorname.substring(0, 2).toLowerCase();

    //Neuen Loginnamen erstellen
    const newName = modifiedName.toLowerCase().replace(/ /g, "");
    const loginName = `${newName}${firstTwo}`;
    return loginName;
  };
  return (
    <Box m="10px">
      <Formik onSubmit={onSubmit} initialValues={initialValues} validationSchema={checkoutSchema}>
        {({ handleSubmit, handleReset, values, setFieldValue }) => (
          <form onSubmit={handleSubmit} onReset={handleReset}>
            <Box
              display="grid"
              gap="15px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
              }}
            >
              <FormInput
                name="name"
                label="Name"
                span={2}
                onChange={(e) => {
                  //Loginname bearbeiten und den Feldwert mit dem neuen Namen aktualisieren
                  setFieldValue("name", e.target.value);
                  const newLogin = editLogin(e.target.value, values.vorname);
                  setFieldValue("login", newLogin);
                }}
              />
              <FormInput
                name="vorname"
                label="Vorname"
                span={2}
                onChange={(e) => {
                  //Loginname bearbeiten und den Feldwert aktualisieren
                  setFieldValue("vorname", e.target.value);
                  const newLogin = editLogin(values.name, e.target.value);
                  setFieldValue("login", newLogin);
                }}
              />
              <FormInput name="namenszusatz" label="Namenszusatz" span={4} />
              <FormInput name="login" label="Login" span={4} />

              <FormInput name="fakultaet" label="Fakultät" span={2} disabled />
              <FormSelect
                name="lehrpersonentyp"
                label="Lehrpersonentyp"
                options={personaltyp}
                span={2}
                defaultValue={initialValues.lehrpersonentyp}
              />

              <FormSelect
                name="zuLoeschen"
                label="ZuLöschen (Opt.)"
                options={zuloeschen}
                span={4}
                defaultValue={"0"}
                helperText={"Wenn Ja, wird der/die Dozent/-in im nächsten Semester nicht übertragt"}
              />

              <Button type="submit" color="primary" variant="contained" sx={{ gridColumn: "span 2" }} size="large">
                Speichern
              </Button>
              <Button type="reset" color="primary" variant="outlined" sx={{ gridColumn: "span 2" }} size="large">
                Zurücksetzen
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

const checkoutSchema = yup.object().shape({
  name: yup.string().required("required"),
  vorname: yup.string().required("required"),
  zuLoeschen: yup.string().required("bitte 0 oder 1 eingeben"),
});

export default EditPerson;
