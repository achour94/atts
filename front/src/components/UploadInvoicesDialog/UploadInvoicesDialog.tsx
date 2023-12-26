import React, { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { DatePicker, LoadingButton } from "@mui/lab";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CloseIcon from "@mui/icons-material/Close";
import CustomDatePicker from "../utils/CustomDatePicker";
import dayjs, { Dayjs } from "dayjs";
import axiosInstance from "../../services/axios";
import { INVOICE_API_URL } from "../../features/invoices/invoiceSlice";
import { toast } from "react-toastify";
import TruncatedText from "../utils/TrancatedText";

interface ImportDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function UploadInvoicesDialog({
  open,
  onClose,
}: ImportDialogProps) {
  const [creationDate, setCreationDate] = useState<Dayjs | null>(
    dayjs("2022-04-17")
  );
  const [reset, setReset] = useState(false);
  const [proforma, setProforma] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleDateChange = (date: Dayjs | null) => {
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
    const formData = new FormData();
    formData.append("file", file!);
    formData.append("creationDate", creationDate!.format("YYYY-MM-DD"));
    formData.append("reset", reset ? "true" : "false");
    formData.append("proforma", proforma ? "true" : "false");
    setLoading(true);
    axiosInstance.post(`${INVOICE_API_URL}/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        }).then(() => {
            setLoading(false);
            onClose();
            toast.success("Import réussi");
            }
        ).catch((error) => {
            setLoading(false);
            console.error("Error uploading file:", error);
            toast.error("Erreur lors de l'import du fichier");
        }
    );
  };

  return (
    <Dialog fullWidth maxWidth="xs" open={open} onClose={onClose}>
      <DialogTitle>
        Import des factures
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ p: 2, pt: "2rem !important" }}>
        <Grid container alignItems="center" px={2}>
          <Grid item xs={12}>
            <Grid container alignItems="center" mb={1}>
            <CustomDatePicker
              label={"Date de création"}
              value={creationDate}
              setValue={handleDateChange}
            />
            </Grid>
            <Divider />
          </Grid>
          <Grid item xs={12}>
            <Grid container alignItems="center" justifyContent={"space-between"} my={2}>
            <Typography>Mise à zéro</Typography>
            <Switch checked={reset} onChange={handleResetToggle} />
            </Grid>
            <Divider />
          </Grid>
          <Grid item xs={12}>
          <Grid container alignItems="center" justifyContent={"space-between"} my={2}>
            <Typography>Factures proforma</Typography>
            <Switch checked={proforma} onChange={handleProformaToggle} />
            </Grid>
            <Divider />
          </Grid>
          <Grid item xs={12}>
          <Grid container alignItems="center" justifyContent={"space-between"} my={2}>
            <Grid item flex={1}>
            <Button
              variant="contained"
              component="label"
              startIcon={<CloudUploadIcon />}
            >
              Importer un fichier
              <input type="file" hidden onChange={handleFileChange} />
            </Button>
            </Grid>
            <Grid item xs={4}>
                {
                    file && (
                        <TruncatedText text={file.name} maxLength={20} />
                    )
                }
                </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Box display="flex" justifyContent="space-between" mt={3}>
              <Button onClick={onClose}>Annuler</Button>
              <LoadingButton
                variant="contained"
                onClick={handleSubmit}
                loading={loading}
                >
                Importer
                </LoadingButton>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
}
