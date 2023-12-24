import { Stack } from '@mui/material'
import React from 'react'
import MuiButton from '../Form/MuiButton'
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
interface Props {
  isAddMode?: boolean
}

function ClientActions({ isAddMode = false }: Props) {
  return (
    <Stack direction="row" spacing={2} justifyContent={'flex-end'}>
      {
        !isAddMode && (
          <>
        <MuiButton type='submit' color='primary' startIcon={<EditIcon />} label='Modifier' />
        <MuiButton color='error' startIcon={<DeleteIcon />} label='Supprimer' />
          </>
        )
      }
      {
        isAddMode && (
          <MuiButton type='submit' color='primary' startIcon={<AddOutlinedIcon />} label='Ajouter' />
        )
      }
    </Stack>
  )
}

export default ClientActions