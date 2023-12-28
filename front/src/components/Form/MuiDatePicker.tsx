import { DatePicker, LocalizationProvider, frFR } from "@mui/x-date-pickers";
import React from "react";
import { FieldError, FieldValue, FieldValues } from "react-hook-form";
import { format, parse, parseISO } from 'date-fns';
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import frLocale from 'date-fns/locale/fr';

interface MuiDatePickerProps {
  field: FieldValues;
  error: FieldError | undefined;
  label: string;
  disabled?: boolean;
}
function MuiDatePicker({ field, error, label, disabled }: MuiDatePickerProps) {

  const dateValue = typeof field.value === 'string' ? parse(field.value, 'dd-MM-yyyy', new Date()) : field.value;

  const handleDateChange = (date: Date | null) => {
    console.log(date);
    if (date) {
      // Format the date to 'day-month-year'
      const formattedDate = format(date, 'dd-MM-yyyy');
      // Use formattedDate to set the value
      field.onChange(formattedDate);
    } else {
      // Handle null (no date selected) case if necessary
      field.onChange(null);
    }
  };
  console.log("date value", dateValue);
  console.log("Disabled", disabled);

  return (
    <LocalizationProvider
      dateAdapter={AdapterDateFns}
      adapterLocale={frLocale}
    >
      <DatePicker
        label={label}
        disabled={disabled}
        {...field}
        onChange={handleDateChange}
        value={dateValue}
        slotProps={{
          textField: {
            error: !!error,
            helperText: error ? error.message : null,
            size: "small",
          },
        }}
      />
    </LocalizationProvider>
  );
}

export default MuiDatePicker;