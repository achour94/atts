import React from 'react'
import { Box, Grid, Switch, TextField, Typography } from '@mui/material'
import ClientAvatar from './ClientAvatar';
import MuiTextField from '../Form/MuiTextField';
import MuiAddress from '../Form/MuiAddress';
import { ClientConstants as CC } from '../../lib/constants/ClientConstants';
import { Controller, useFormContext } from 'react-hook-form';

function ClientInformations() {
    const { control } = useFormContext();

    return (
        <Box>
            <ClientAvatar />
            <Box px={'1.5rem'} py={'0.75rem'}>
                <Grid container rowSpacing={4}>
                    <Grid item xs={12}>
                        <MuiTextField name={CC.CLIENT_NAME} label='Nom' placeholder='Nom' />
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <MuiTextField name={CC.CLIENT_EMAIL} label='Email' placeholder='Email' />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <MuiTextField name="phone" label='Numéro de téléphone' placeholder='0033*********' />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <MuiAddress />
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container spacing={2}>
                            <Grid item xs={4}>
                                <MuiTextField name={CC.CLIENT_DEFAULTSUBSCRIPTION} label='Abonnement' placeholder='Abonnement' />
                            </Grid>
                            <Grid item xs={4}>
                                <MuiTextField name={CC.CLIENT_CLIENTREFERENCE} label='Référence' placeholder='Référence' />
                            </Grid>
                            <Grid item xs={4}>
                                <Grid container alignItems='center' justifyContent='space-between' >
                                    <Grid item>
                                        <Typography sx={{fontSize: "1rem", fontWeight: 700, fontStyle: "normal", lineHeight: '1.875rem'}}>
                                            Montant divers
                                        </Typography>
                                    </Grid>
                                    <Grid item>
                                        <Controller
                                            name={CC.CLIENT_ACTIVEDIVERSE}
                                            control={control}
                                            render={({ field: { onChange, value } }) => (
                                                <Switch
                                                    checked={value}
                                                    onChange={onChange}
                                                    color="success" // This makes the switch green when checked
                                                    size='small'
                                                />
                                            )}
                                        />
                                    </Grid>
                                </Grid>
                                    <Controller
                                        name={CC.CLIENT_DIVERSESUBSCRIPTION}
                                        control={control}
                                        render={({ field: { onChange, onBlur, value, ref }, fieldState: { error } }) => (
                                            <TextField
                                                fullWidth
                                                variant="outlined"
                                                placeholder='Montant divers'
                                                sx={{
                                                    mt: "0.75rem",
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
                                            />
                                        )}
                                    />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
}


export default ClientInformations