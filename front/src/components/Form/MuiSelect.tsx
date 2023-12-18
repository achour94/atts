import {
  Box,
  FormControl,
  FormHelperText,
  InputLabel,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { error } from "console";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Form } from "react-router-dom";

interface SelectProps {
  name: string;
  label: string;
  placeholder?: string;
  children?: React.ReactNode;
  disabled?: boolean;
}

function MuiSelect({ name, label, placeholder, children, disabled }: SelectProps) {
  const { control } = useFormContext();
  return (
    <FormControl fullWidth size="small">
      <InputLabel id="demo-simple-select-label">{label}</InputLabel>
      <Controller
        name={name}
        control={control}
        defaultValue=""
        render={({ field, fieldState: { error } }) => (
          <>
            <Select
              {...field}
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label={label}
              disabled={disabled}
              error={!!error}
            >
              {children}
            </Select>
            <FormHelperText sx={{color: 'red'}} >{error ? error.message : null}</FormHelperText>
          </>
        )}
      />
    </FormControl>
  );
}

export default MuiSelect;
