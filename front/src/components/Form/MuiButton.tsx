import { Button, ButtonProps, Typography } from '@mui/material'
import React from 'react'

interface MuiButtonProps extends ButtonProps{
  label: string;
}

function MuiButton({ color, startIcon, label, ...otherProps }: MuiButtonProps) {
  return (
    <Button 
      variant="contained" 
      startIcon={startIcon} 
      color={color} 
      sx={{
        borderRadius: "2rem",
        px: "1.5rem",
        py: "0.5rem"
      }}
      {...otherProps}
    >
      <Typography sx={{fontSize: "0.75rem", fontWeight: 700, fontStyle: "normal"}}>
        {label}
      </Typography>
    </Button>
  )
}

export default MuiButton