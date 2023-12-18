import { Stack } from '@mui/material'
import React from 'react'
import MuiButton from '../Form/MuiButton'
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

function ClientActions() {
  return (
    <Stack direction="row" spacing={2} justifyContent={'flex-end'}>
        <MuiButton type='submit' color='primary' startIcon={<EditIcon />} label='Modifier' />
        <MuiButton color='error' startIcon={<DeleteIcon />} label='Supprimer' />
    </Stack>
  )
}

export default ClientActions