import { Box, Button } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";

import { FormInput, FormSelect } from "../../components/formComponents";
import { personaltyp } from "../../constants";

const AddPerson = ({ onSubmit }) => {
  const isNonMobile = useMediaQuery("(min-width:600px)");

  //Funktion zum Umwandeln von Sonderzeichen
  const convertSpecialCharacters = (name) => {
    return name
      .replace(/Ö/g, "oe")
      .replace(/Ä/g, "ae")
      .replace(/Ü/g, "ue")
      .replace(/ö/g, "oe")
      .replace(/ä/g, "ae")
      .replace(/ü/g, "ue");
  };

  {
    /* Funktion zum Bearbeiten des Loginnamens
     * Der Nachname und die ersten beiden Buchtaben des Vornamens (in Kleinbuchstaben) werden unter Berücksichtigung der Sonderzeichen kombiniert
     */
  }
  const editLogin = (name, vorname) => {
    const firstTwo = convertSpecialCharacters(vorname.substring(0, 2).toLowerCase());
    return `${convertSpecialCharacters(name.toLowerCase())}${firstTwo}`;
  };

  return (
    <Box m="10px">
      <Formik
        onSubmit={(values) => {
          const loginName = editLogin(values.name, values.vorname);
          values.login = loginName;
          onSubmit(values);
        }}
        initialValues={initialValues}
        validationSchema={checkoutSchema}
      >
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
              <FormInput name="name" label="Name" span={2} />
              <FormInput name="vorname" label="Vorname" span={2} />
              <FormInput name="namenszusatz" label="Namenszusatz" span={4} />
              <FormInput
                name="login"
                label="Login"
                span={4}
                value={editLogin(values.name, values.vorname)}
                onChange={(e) => setFieldValue("login", e.target.value)}
                readOnly
              />
              <FormInput name="fakultaet" label="Fakultät" span={2} disabled />
              <FormSelect
                name="lehrpersonentyp"
                label="Lehrpersonentyp"
                options={personaltyp}
                defaultValue={"PF"}
                span={2}
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
  fakultaet: yup.string().required("required"),
});

const initialValues = {
  name: "",
  vorname: "",
  namenszusatz: "",
  login: "",
  fakultaet: "sw",
  lehrpersonentyp: "PF",
  zuLoeschen: "0",
};
export default AddPerson;
