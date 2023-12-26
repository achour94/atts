import React from 'react'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { frFR } from '@mui/x-date-pickers/locales';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Dayjs } from 'dayjs';

interface CustomDatePickerProps {
    label: string;
    value: Dayjs | null;
    setValue: (value: Dayjs | null) => void;
}

function CustomDatePicker({ value, setValue, label }: CustomDatePickerProps) {
  return (
    <LocalizationProvider
        localeText={frFR.components.MuiLocalizationProvider.defaultProps.localeText} 
        dateAdapter={AdapterDayjs}>
        <DatePicker
          label={label}
          value={value}
          onChange={(newValue) => setValue(newValue)}
        />
    </LocalizationProvider>
  )
}

export default CustomDatePicker