import { TextField, Typography } from "@mui/material";
import { useField } from "formik";

export default function TextfieldWrapper({ name, span, helperText, maxLength, ...otherProps }) {
  const [field, meta] = useField(name);

  const configTextfield = {
    ...field,
    ...otherProps,
    size: "small",
    fullWidth: true,
    variant: "outlined",
    error: meta.touched && Boolean(meta.error),
    slotProps: {
      htmlInput: { maxLength: maxLength || undefined },
    },
  };

  return (
    <TextField
      sx={{ gridColumn: `span ${span}` }}
      {...configTextfield}
      helperText={
        meta.touched && meta.error ? (
          <Typography variant="h7" color="error">
            {meta.error}
          </Typography>
        ) : (
          helperText && (
            <Typography variant="h7">
              <i>{helperText}</i>
            </Typography>
          )
        )
      }
    />
  );
}
