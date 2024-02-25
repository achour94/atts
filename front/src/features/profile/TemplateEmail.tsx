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
import { Box } from "@mui/material";
import EmailTemplateDialog from "./EmailTemplateDialog";
import axiosInstance from "../../services/axios";
import { USER_API_URL } from "../../lib/constants/UserConstants";
import {
  convertTextToEditorState,
  formatMailTemplateData,
} from "../../utils/utils";
import { IEmailTemplate } from "../../lib/interfaces/IUser";
import { EmailTemplateConstants as ETC } from "../../lib/constants/EmailTemplateConstants";
import { toast } from "react-toastify";
import MuiConfirmDialog from "../../components/Form/MuiDialog/MuiConfirmationDialog";
import { Editor } from "react-draft-wysiwyg";

interface MailTemplateProps {
  emailTemplatesProps: IEmailTemplate[];
  userId: number | undefined;
}

const MailTemplate: React.FC<MailTemplateProps> = ({
  emailTemplatesProps,
  userId,
}) => {
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [emailTemplates, setEmailTemplates] =
    useState<IEmailTemplate[]>(emailTemplatesProps);
  const [emailTemplate, setEmailTemplate] = useState<IEmailTemplate | null>();
  const [idEmailTemplateToDelete, setIdEmailTemplateToDelete] = useState<
    number | null
  >();
  const [confirmationDialogOpen, setConfirmationDialogOpen] =
    useState<boolean>(false);
  const [isCreateEmailTemplate, setIsCreateEmailTemplate] =
    useState<boolean>(false);

  const onDialogClose = () => {
    setDialogOpen(false);
    setEmailTemplate(null);
  };

  const onConfirmationDialogClose = () => {
    setConfirmationDialogOpen(false);
    setIdEmailTemplateToDelete(null);
  };

  useEffect(
    () => setEmailTemplates(emailTemplatesProps),
    [emailTemplatesProps]
  );
  const fetchEmailTemplates = (): void => {
    axiosInstance
      .get(`${USER_API_URL}/emailtemplates`)
      .then((response) => {
        if (response && response.data) {
          const emailTemplateResponse = response.data.map(
            formatMailTemplateData
          );
          setEmailTemplates(emailTemplateResponse);
        }
      })
      .catch((error) => {
        console.log(error);
        toast.error("Erreur lors de la récupération des templates d'email");
      });
  };

  const deleteEmailTemplate = () => {
    const apiUrl = USER_API_URL + "/emailtemplate/" + idEmailTemplateToDelete;

    axiosInstance
      .delete(apiUrl)
      .then(() => {
        toast.success("template email supprimé avec succès !");
        fetchEmailTemplates();
      })
      .catch((error) => {
        toast.error(
          "Une erreur s'est produite lors de la suppression du template email"
        );
      });
  };

  const handleDelete = () => {
    setConfirmationDialogOpen(false);
    deleteEmailTemplate();
  };

  return (
    <>
      {emailTemplates?.map((emailTemplate, key) => {
        return (
          <Accordion key={key} sx={{ backgroundColor: "white" }}>
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
                      [ETC.EMAILTEMPLATE_ID]:
                        emailTemplate[ETC.EMAILTEMPLATE_ID],
                      [ETC.EMAILTEMPLATE_NAME]:
                        emailTemplate[ETC.EMAILTEMPLATE_NAME],
                      [ETC.EMAILTEMPLATE_CONTENT]:
                        emailTemplate[ETC.EMAILTEMPLATE_CONTENT],
                    });
                    setDialogOpen(true);
                    setIsCreateEmailTemplate(false);
                  }}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  aria-label="delete"
                  size="large"
                  onClick={(event) => {
                    event.stopPropagation();
                    setIdEmailTemplateToDelete(
                      emailTemplate[ETC.EMAILTEMPLATE_ID]
                    );
                    setConfirmationDialogOpen(true);
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Editor
                editorState={convertTextToEditorState(emailTemplate.content)}
                readOnly={true}
                toolbarHidden={true}
              />
            </AccordionDetails>
          </Accordion>
        );
      })}
      <EmailTemplateDialog
        emailTemplateId={emailTemplate?.[ETC.EMAILTEMPLATE_ID]}
        name={emailTemplate?.[ETC.EMAILTEMPLATE_NAME]}
        content={emailTemplate?.[ETC.EMAILTEMPLATE_CONTENT]}
        userId={userId}
        open={dialogOpen}
        isCreate={isCreateEmailTemplate}
        onClose={onDialogClose}
        fetchEmailTemplates={fetchEmailTemplates}
      />
      <MuiConfirmDialog
        open={confirmationDialogOpen}
        onClose={onConfirmationDialogClose}
        onConfirm={handleDelete}
        title={"Confirmer la suppression du template"}
        message={"Êtes-vous sûr de vouloir supprimer ce template de mail ?"}
      />

      <Accordion sx={{ backgroundColor: "white" }} expanded={false}>
        <Button
          sx={{ margin: "10px" }}
          startIcon={<AddIcon />}
          variant="text"
          onClick={() => {
            setIsCreateEmailTemplate(true);
            setDialogOpen(true);
          }}
        >
          Ajouter un template
        </Button>
      </Accordion>
    </>
  );
};

export default MailTemplate;
