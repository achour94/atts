import { Box, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import React from 'react'
import MuiButton from '../../components/Form/MuiButton'
import PageTitle from '../../components/Typography/PageTitle'
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import MuiTable from '../../components/MuiTable/MuiTable';

function Clients() {
  return (
    <Box sx={{
        width: "100%",
    }} >
        <Box>
            <Grid container sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mt: 7
            }} >
                <Grid item flex={1}>
                    <PageTitle title='Mes Clients' />
                </Grid>
                <Grid item>
                    <MuiButton startIcon={<AddOutlinedIcon />} label="Ajouter un client" color="primary" />
                </Grid>
            </Grid>
            <Grid mt={2} >
                <MuiTable />
            </Grid>
        </Box>
    </Box>
  )
}

export default Clients