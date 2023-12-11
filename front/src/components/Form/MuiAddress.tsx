import { Box, Grid, TextField, Typography } from '@mui/material'
import React from 'react'
import { Controller, useFormContext } from 'react-hook-form';
import { ClientConstants as CC } from '../../lib/constants/ClientConstants';

const textFieldStyle = {
    mt: "0.75rem",
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: '#EAEEF4', // Default border color
      },
    //   '&:hover fieldset': {
    //     borderColor: 'blue', // Border color on hover
    //   },
    //   '&.Mui-focused fieldset': {
    //     borderColor: 'red', // Border color when the TextField is focused
    //   },
    },
  }

function MuiAddress() {
    const { control } = useFormContext();

  return (
    <Box sx={{
        width: "100%",
    }} >
        <Typography sx={{fontSize: "1rem", fontWeight: 700, fontStyle: "normal", lineHeight: '1.875rem'}}>
            Adresse
        </Typography>
        <Grid container rowSpacing={2}>
            <Grid item xs={12}>
                <Controller
                    name={CC.CLIENT_ADDRESS}
                    control={control}
                    render={({ field: { onChange, onBlur, value, ref }, fieldState: { error } }) => (
                        <TextField
                            fullWidth
                            variant="outlined"
                            sx={textFieldStyle}
                            placeholder='Rue'
                            value={value}
                            onChange={onChange}
                            onBlur={onBlur}
                            ref={ref}
                            error={!!error}
                            helperText={error ? error.message : null}
                        />
                    )}
                />
            </Grid>
            <Grid item xs={12} sm={12}>
                <Grid container spacing={2}>
                    <Grid item xs={8}>
                        {/* <Controller
                            name="city"
                            control={control}
                            render={({ field: { onChange, onBlur, value, ref }, fieldState: { error } }) => (
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    sx={textFieldStyle}
                                    placeholder='Ville'
                                    value={value}
                                    onChange={onChange}
                                    onBlur={onBlur}
                                    ref={ref}
                                    error={!!error}
                                    helperText={error ? error.message : null}
                                />
                            )}
                        /> */}
                    </Grid>
                    <Grid item xs={4}>
                        <Controller
                            name={CC.CLIENT_POSTALCODE}
                            control={control}
                            render={({ field: { onChange, onBlur, value, ref }, fieldState: { error } }) => (
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    sx={textFieldStyle}
                                    placeholder='Code postal'
                                    value={value}
                                    onChange={onChange}
                                    onBlur={onBlur}
                                    ref={ref}
                                    error={!!error}
                                    helperText={error ? error.message : null}
                                />
                            )}
                        />
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    </Box>
  )
}

export default MuiAddress