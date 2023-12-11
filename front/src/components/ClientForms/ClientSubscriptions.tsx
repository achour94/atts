import React from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import {
  Paper,
  IconButton,
  Button,
  Box,
  List,
  ListItem,
  Typography,
  Grid
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { ClientConstants as CC } from '../../lib/constants/ClientConstants';
import { IClient } from '../../lib/interfaces/IClient';

const headCellStyle = {
    fontSize: '1rem',
    fontWeight: 700,
    fontStyle: 'normal',
    lineHeight: 'normal',
    color: '#696969',
    
};

function ClientSubscriptions() {
  const { control } = useFormContext<IClient>(); 
  const { fields } = useFieldArray({
    control,
    name: CC.CLIENT_SUBSCRIPTIONLIST, 
  });

  return (
    <Box sx={{ p: 2, backgroundColor: '#FFFFFF', borderRadius: '8px', overflow: 'hidden' }}>
      <Paper elevation={0} sx={{ boxShadow: 'none' }}>
        <List sx={{ width: '100%' }}>
            <ListItem
                sx={{
                    mb: "1rem",
                }}
            >
                <Box sx={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Grid container>
                        <Grid item xs={3} sx={{display: 'flex', justifyContent: 'start', alignItems: 'center'}} >
                            <Typography variant="body1" sx={headCellStyle} >Nom</Typography>
                        </Grid>
                        <Grid item xs={3} sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}} >
                            <Typography variant="body1" sx={headCellStyle} >Données</Typography>
                        </Grid>
                        <Grid item xs={3} sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}} >
                            <Typography variant="body1" sx={headCellStyle} >Prix</Typography>
                        </Grid>
                        <Grid item xs={3} sx={{display: 'flex', justifyContent: 'end', alignItems: 'center'}} >
                            <Typography variant="body1" sx={headCellStyle} >Options</Typography>
                        </Grid>
                    </Grid>
                </Box>
            </ListItem>
          {fields.map((subscription , index) => (
            <ListItem
              key={index}
              sx={{
                mb: 2,
                border: '1px solid #EAEEF4',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                '&:last-child': {
                  mb: 0,
                },
              }}
            >
                <Box sx={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Grid container>
                        <Grid item xs={3} sx={{display: 'flex', justifyContent: 'start', alignItems: 'center'}} >
                            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{subscription[CC.CLIENT_SUBSCRIPTION_NAME]}</Typography>
                        </Grid>
                        <Grid item xs={3} sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}} >
                        <Typography variant="body1">{subscription[CC.CLIENT_SUBSCRIPTION_DATA]}</Typography>
                        </Grid>
                        <Grid item xs={3} sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}} >
                        <Typography variant="body1">{subscription[CC.CLIENT_SUBSCRIPTION_PRICE]}</Typography>
                        </Grid>
                        <Grid item xs={3} sx={{display: 'flex', justifyContent: 'end', alignItems: 'center'}} >
                        <IconButton edge="end" aria-label="options">
                        <MoreVertIcon />
                        </IconButton>
                        </Grid>
                    </Grid>
                </Box>
            </ListItem>
          ))}
        </List>
      </Paper>
      <Button
        startIcon={<AddCircleOutlineIcon />}
        sx={{ mt: 2, float: 'right' }}
        color="primary"
      >
        Ajouter
      </Button>
    </Box>
  );
}

export default ClientSubscriptions;