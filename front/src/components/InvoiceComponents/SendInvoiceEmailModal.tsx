import React, { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  Divider,
} from "@mui/material";
import AttachEmailOutlinedIcon from "@mui/icons-material/AttachEmailOutlined";
import { toast } from "react-toastify";
import axiosInstance from "../../services/axios";
import { USER_API_URL } from "../../lib/constants/UserConstants";
import WYSIWYGEditor from "../Form/WYSIWYGEditor";
import { sendInvoicesByEmail } from "../../services/api";
import { IEmailTemplate } from "../../lib/interfaces/IUser";
import { formatMailTemplateData } from "../../utils/utils";
import { SendInvoiceByMailRequest } from "../../lib/interfaces/IInvoice";

interface SendInvoiceEmailModalProps {
  open: boolean;
  onClose: () => void;
  invoiceIds: number[];
}

const SendInvoiceEmailModal: React.FC<SendInvoiceEmailModalProps> = ({
  open,
  onClose,
  invoiceIds,
}) => {
  const [emailTemplates, setEmailTemplates] = useState<IEmailTemplate[]>([]);
  const [selectedTemplateContent, setSelectedTemplateContent] = useState("");
  const [error, setError] = useState("");

  // Fetch email templates
  const fetchEmailTemplates = useCallback(() => {
    axiosInstance
      .get(`${USER_API_URL}/emailtemplates`)
      .then((response) => {
        const formattedEmailTemplates = response.data.map(
          formatMailTemplateData
        );
        setEmailTemplates(formattedEmailTemplates);
      })
      .catch((error) => {
        console.error(error);
        toast.error(
          "Une erreur s'est produite lors de la récupération des modèles d'email"
        );
      });
  }, []);

  useEffect(() => {
    if (open) {
      fetchEmailTemplates();
    }
  }, [open, fetchEmailTemplates]);

  const sendEmails = () => {
    if (!selectedTemplateContent) {
      setError("Le contenu du template est requis");
      return;
    }
    const emailData: SendInvoiceByMailRequest = {
      invoiceIds,
      emailContent: selectedTemplateContent,
    };
    sendInvoicesByEmail(emailData)
        .then(() => {
            toast.success("Factures envoyées avec succès");
            onClose();
        })
        .catch((error) => {
            console.error("Error sending invoices:", error);
            setError("Erreur lors de l'envoi des factures");
        });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Grid container alignItems={"center"} spacing={2}>
          <Grid item sx={{ mt: "1.125rem", color: "#157EB5" }}>
            <AttachEmailOutlinedIcon fontSize="large" />
          </Grid>
          <Grid item>Envoyer les factures par email</Grid>
        </Grid>
      </DialogTitle>
      <Divider /> {/* Divider between title and content */}
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="email-template-select-label">
                Template d'email
              </InputLabel>
              <Select
                labelId="email-template-select-label"
                id="email-template-select"
                value={selectedTemplateContent}
                label="Template d'email"
                onChange={(e) => setSelectedTemplateContent(e.target.value)}
              >
                {emailTemplates.map((template) => (
                  <MenuItem
                    key={template.emailTemplateId}
                    value={template.content}
                  >
                    {template.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            {/* WYSIWYG Editor */}
            <Box mt={2}>
              <Typography
                sx={{
                  fontSize: "1rem",
                  fontWeight: 700,
                  fontStyle: "normal",
                  lineHeight: "1.875rem",
                  mb: "0.5rem",
                }}
              >
                Contenu du template
              </Typography>
              <WYSIWYGEditor
                onChange={(content) => setSelectedTemplateContent(content)}
                value={selectedTemplateContent}
              />
              {error && (
                <p
                  style={{
                    color: "red",
                    fontSize: "0.75rem",
                    marginLeft: "0.5rem",
                  }}
                >
                  {error}
                </p>
              )}
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Annuler</Button>
        <Button onClick={sendEmails} >Envoyer</Button>
      </DialogActions>
    </Dialog>
  );
};

export default SendInvoiceEmailModal;
