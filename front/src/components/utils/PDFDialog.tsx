import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import PDFViewer from './PDFViewer';

interface PDFDialogProps {
  pdfFile: string | Uint8Array; // URL or Uint8Array of the PDF
  pdfFileName: string; // Name of the PDF file for the dialog title
  open: boolean; // Control the dialog visibility from parent
  onClose: () => void; // Handle closing the dialog
}

const PDFDialog: React.FC<PDFDialogProps> = ({ pdfFile, pdfFileName, open, onClose }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="pdf-dialog-title"
      maxWidth="lg" // Adjust size as needed
    //   fullWidth
    >
      <DialogTitle id="pdf-dialog-title">{pdfFileName}</DialogTitle>
      <DialogContent dividers>
        <PDFViewer file={pdfFile} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Fermer</Button>
      </DialogActions>
    </Dialog>
  );
};

export default PDFDialog;
