import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Box, Button, TextField } from "@mui/material";
import { FormInput } from "../formComponents";

/**
 * Formik-Konfiguration für Modulverwaltung
 * Diese Komponente ist nicht verwendet im Projekt,
 * da die Verwendung der Inline-Tabellebearbeitung für Modulverwaltung wird entgescheidet.
 */

const initialModulValue = {
  modul_id: "",
  name: "",
};
const initialLvValue = {
  id: "0", // Default = 0, Id wird in API automatisiert generiert
  modul_id: "",
  name: "",
};

export function AddNewModul({ onSubmit }) {
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const checkoutSchema = yup.object().shape({
    modul_id: yup.string().required("Bitte eingeben"),
    name: yup.string().required("Bitte eingeben"),
  });
  return (
    <Box m={"10px"}>
      <Formik onSubmit={onSubmit} initialValues={initialModulValue} validationSchema={checkoutSchema}>
        {({ handleSubmit, handleReset }) => (
          <form onSubmit={handleSubmit} onReset={handleReset}>
            <Box
              display={"grid"}
              gap={"15px"}
              gridTemplateColumns="repeat(2, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 2" },
              }}
            >
              <FormInput name={"modul_id"} label={"ID"} span={2} />
              <FormInput name={"name"} label={"Titel"} span={2} />
              <Button type="submit" variant="contained">
                Hinzufügen
              </Button>
              <Button type="reset" variant="outlined">
                Zurücksetzen
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
}

export function AddNewLv({ onSubmit, modul_id = "", modul_name = "" }) {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const checkoutSchema = yup.object().shape({
    modul_id: yup.string().required("Bitte eingeben"),
    name: yup.string().required("Bitte eingeben"),
  });
  initialLvValue.modul_id = modul_id;
  return (
    <Box m={"10px"}>
      <Formik onSubmit={onSubmit} initialValues={initialLvValue} validationSchema={checkoutSchema}>
        {({ handleSubmit, handleReset }) => (
          <form onSubmit={handleSubmit} onReset={handleReset}>
            <Box
              display={"grid"}
              gap={"15px"}
              gridTemplateColumns="repeat(2, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 2" },
              }}
            >
              <TextField
                label={"Modul"}
                sx={{ gridColumn: "span 2" }}
                size="small"
                disabled
                defaultValue={`${modul_id} ${modul_name}`}
              />
              <FormInput name={"name"} label={"Titel"} span={2} />
              <Button type="submit" variant="contained">
                Hinzufügen
              </Button>
              <Button type="reset" variant="outlined">
                Zurücksetzen
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
}
