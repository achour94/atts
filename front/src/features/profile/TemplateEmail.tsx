import React, { useEffect, useState } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import Button from "@mui/material/Button";
import { Box, Stack, TextField } from "@mui/material";
import EmailTemplateDialog from "./EmailTemplateDialog";
import axiosInstance from "../../services/axios";
import { USER_API_URL } from "../../lib/constants/UserConstants";
import { formatMailTemplateData } from "../../utils/utils";
import { IEmailTemplate } from "../../lib/interfaces/IUser";
import { EmailTemplateConstants as ETC } from "../../lib/constants/EmailTemplateConstants";
import { toast } from "react-toastify";

const MailTemplate = () => {
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [emailTemplates, setEmailTemplates] = useState<IEmailTemplate[]>();
  const [emailTemplate, setEmailTemplate] = useState<IEmailTemplate| null>();

  const onDialogClose = () => {
    setDialogOpen(false);
    setEmailTemplate(null);
  };

  const geEmailTemplates = (): void => {
    axiosInstance
      .get(`${USER_API_URL}/emailtemplates`)
      .then((response) => {
        if (response && response.data) {
          const emailTemplateResponse = response.data.map(
            formatMailTemplateData
          );
          setEmailTemplates(emailTemplateResponse);
          console.log("zzzzzz", emailTemplateResponse);
        }
      })
      .catch((error) => {
        console.log(error);
        toast.error("Erreur lors de la récupération des templates d'email");
      });
  };

  useEffect(() => {
    geEmailTemplates();
  }, []);

  return (
    <div>
      {emailTemplates?.map((emailTemplate) => {
        return (
          <Accordion sx={{ backgroundColor: "white" }}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
              sx={{ height: "10px" }}
            >
              <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center" }}>
                <Typography sx={{ flexShrink: 0 }}>
                  {emailTemplate.name}
                </Typography>
                <Box sx={{ flexGrow: 1 }} />
                <IconButton
                  aria-label="edit"
                  size="large"
                  onClick={(event) => {
                    event.stopPropagation();
                    setEmailTemplate({
                      [ETC.EMAILTEMPLATE_NAME]: emailTemplate.name,
                      [ETC.EMAILTEMPLATE_CONTENT]:emailTemplate.content})
                    setDialogOpen(true);
                    
                  }}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  aria-label="delete"
                  size="large"
                  onClick={(event) => {
                    event.stopPropagation();
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <TextField
                fullWidth
                multiline
                rows={4}
                variant="outlined"
                value={emailTemplate.content}
              />
            </AccordionDetails>
          </Accordion>
        );
      })}
       <EmailTemplateDialog
        name={emailTemplate?.name}
        content={emailTemplate?.content}
        open={dialogOpen}
        onClose={onDialogClose}
      />
      <Button
        startIcon={<AddIcon />}
        variant="text"
        onClick={() => setDialogOpen(true)}
      >
        Ajouter un template
      </Button>
    </div>
  );
};

export default MailTemplate;
