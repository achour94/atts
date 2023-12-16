import {
    Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React from "react";

function MuiTable() {
  return (
    <TableContainer component={Paper} sx={{backgroundColor: 'transparent', boxShadow: 'none'}} >
      <Table sx={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 0.75rem' }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>
                <Box sx={{display: 'flex', alignItems: 'center'}}>
                    <Box sx={{mr: 1}}>
                        <Typography sx={{fontSize: '0.75rem', fontWeight: 500, fontStyle: 'normal', color: 'text.secondary'}}>Nom</Typography>
                    </Box>
                    <Box>
                        <p>^</p>
                    </Box>
                </Box>
            </TableCell>
            <TableCell align="right">Email</TableCell>
            <TableCell align="right">Ville</TableCell>
            <TableCell align="right">Pays</TableCell>
            <TableCell align="right">Téléphone</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {[...Array(3)].map((_, index) => (
            <TableRow 
              key={index} 
              sx={{ 
                backgroundColor: 'white',
              }}
            >
              <TableCell>Nom</TableCell>
              <TableCell align="right">Email</TableCell>
              <TableCell align="right">Ville</TableCell>
              <TableCell align="right">Pays</TableCell>
              <TableCell align="right">Téléphone</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default MuiTable;
