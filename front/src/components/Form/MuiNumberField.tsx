import { Box, TextField, Typography } from "@mui/material";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";

interface MuiNumberFieldProps {
  name: string;
  label: string;
  placeholder?: string;
  step?: string;
  size?: "small" | "medium";
}

function MuiNumberField({ name, label, placeholder, step, size }: MuiNumberFieldProps) {
  const { control } = useFormContext();
  return (
    <Box
      sx={{
        width: "100%",
      }}
    >
      <Typography
        sx={{
          fontSize: "1rem",
          fontWeight: 700,
          fontStyle: "normal",
          lineHeight: "1.875rem",
        }}
      >
        {label}
      </Typography>
      <Controller
        name={name}
        control={control}
        render={({
          field: { onChange, onBlur, value, ref },
          fieldState: { error },
        }) => (
          <TextField
            fullWidth
            size={size ?? "medium"}
            variant="outlined"
            type="number"
            InputProps={{
              inputProps: { min: 0, step: step ?? 1 },
            }}
            placeholder={placeholder}
            sx={{
              mt: "0.75rem",
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#EAEEF4", // Default border color
                },
                // Additional styles for hover, focus, etc.
              },
            }}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            inputRef={ref}
            error={!!error}
            helperText={error ? error.message : null}
          />
        )}
      />
    </Box>
  );
}

export default MuiNumberField;
