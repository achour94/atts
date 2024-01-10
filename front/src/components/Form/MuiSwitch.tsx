import {
  Box,
  FormControl,
  FormHelperText,
  InputLabel,
  Select,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";

interface SwitchProps {
  name: string;
  disabled?: boolean;
}

function MuiSwitch({ name, disabled }: SwitchProps) {
  const { control } = useFormContext();
  return (
    <FormControl fullWidth size="small">
      <Controller
        name={name}
        control={control}
        defaultValue=""
        render={({ field, fieldState: { error } }) => (
          <>
            <Switch
              {...field}
              checked={field.value}
              disabled={disabled}
              size="small"
              color="success" // This makes the switch green when checked
            />
            <FormHelperText sx={{color: 'red'}} >{error ? error.message : null}</FormHelperText>
          </>
        )}
      />
    </FormControl>
  );
}

export default MuiSwitch;
