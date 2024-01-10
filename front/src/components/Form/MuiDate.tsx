import { Box, TextField, Typography } from "@mui/material";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { format, parse, parseISO } from "date-fns";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import frLocale from "date-fns/locale/fr";

interface DateProps {
  name: string;
  label: string;
  disabled?: boolean;
}

function MuiDate({ name, label, disabled }: DateProps) {
  const { control } = useFormContext();

  const getDateValue = (dateValue: any) => {
    if (typeof dateValue === "string") {
      return parse(dateValue, "dd-MM-yyyy", new Date());
    }
    return dateValue;
  };
  
  const handleDateChange = (date: Date | null, field: any) => {
    console.log(date);
    if (date) {
      // Format the date to timeStamp
      const formattedDate = date.getTime();
      // Use formattedDate to set the value
      field.onChange(formattedDate);
    } else {
      // Handle null (no date selected) case if necessary
      field.onChange(null);
    }
  };
  return (
    <Box
      sx={{
        width: "100%",
      }}
    >
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState: { error } }) => (
          <LocalizationProvider
            dateAdapter={AdapterDateFns}
            adapterLocale={frLocale}
          >
            <DatePicker
              label={label}
              disabled={disabled}
              {...field}
              onChange={(date) => handleDateChange(date, field)}
              value={getDateValue(field.value)}
              slotProps={{
                textField: {
                  error: !!error,
                  helperText: error ? error.message : null,
                  size: "small",
                  fullWidth: true,
                },
              }}
            />
          </LocalizationProvider>
        )}
      />
    </Box>
  );
}

export default MuiDate;
