import { Box, InputBaseProps, TextField, Typography } from '@mui/material'
import React from 'react'
import { Controller, useFormContext } from 'react-hook-form';

interface TextFieldProps {
    name: string;
    label: string;
    placeholder?: string;
    type?:string;
    disabled?:boolean;
    inputProps?: InputBaseProps;
}

function MuiTextField({name, label, placeholder, type, inputProps, disabled}: TextFieldProps) {
    const { control } = useFormContext();
  return (
    <Box sx={{
        width: "100%",
    }} >
        <Typography sx={{fontSize: "1rem", fontWeight: 700, fontStyle: "normal", lineHeight: '1.875rem'}}>
            {label}
        </Typography>
        <Controller
                name={name}
                control={control}
                render={({ field: { onChange, onBlur, value, ref }, fieldState: { error } }) => (
                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder={placeholder}
                        sx={{
                            mt: "0.5rem",
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: '#EAEEF4', // Default border color
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
                        type={type}
                        disabled={disabled}
                        InputProps={inputProps}

                    />
                )}
            />
    </Box>
  )
}

export default MuiTextField