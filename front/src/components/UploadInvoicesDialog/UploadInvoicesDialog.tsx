import React, { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { DatePicker } from '@mui/lab';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloseIcon from '@mui/icons-material/Close';

interface ImportDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function UploadInvoicesDialog({ open, onClose }: ImportDialogProps) {
  const [creationDate, setCreationDate] = useState<Date | null>(new Date());
  const [reset, setReset] = useState(false);
  const [proforma, setProforma] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const handleDateChange = (date: Date | null) => {
    setCreationDate(date);
  };

  const handleResetToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setReset(event.target.checked);
  };

  const handleProformaToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setProforma(event.target.checked);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

  const handleSubmit = () => {
    // Implement your file upload logic here
    console.log({
      creationDate,
      reset,
      proforma,
      file,
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        Import des factures
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12}>
            <DatePicker
              label="Date de création"
              value={creationDate}
              onChange={handleDateChange}
              renderInput={(params: any) => <TextField fullWidth {...params} />}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography>Mise à zéro</Typography>
            <Switch checked={reset} onChange={handleResetToggle} />
          </Grid>
          <Grid item xs={12}>
            <Typography>Factures proforma</Typography>
            <Switch checked={proforma} onChange={handleProformaToggle} />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              component="label"
              startIcon={<CloudUploadIcon />}
            >
              Cliquer pour importer un fichier
              <input
                type="file"
                hidden
                onChange={handleFileChange}
              />
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Box display="flex" justifyContent="space-between">
              <Button onClick={onClose}>Annuler</Button>
              <Button variant="contained" onClick={handleSubmit}>Importer</Button>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
}
