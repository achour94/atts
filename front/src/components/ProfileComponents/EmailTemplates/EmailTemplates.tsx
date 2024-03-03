import React, { useCallback, useEffect, useState } from "react";
import { Typography, Button, Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EmailTemplateModal from "./EmailTemplateModal";
import { IEmailTemplate } from "../../../lib/interfaces/IUser";
import axiosInstance from "../../../services/axios";
import { USER_API_URL } from "../../../lib/constants/UserConstants";
import { toast } from "react-toastify";
import { formatMailTemplateData } from "../../../utils/utils";
import EmailTemplate from "./EmailTemplate";
import { EmailTemplateConstants as ETC } from "../../../lib/constants/EmailTemplateConstants";
import ConfirmationPopup from "../../utils/ConfirmationPopup";

interface EmailTemplatesProps {
  userEmail: string;
}

const EmailTemplates: React.FC<EmailTemplatesProps> = ({ userEmail }) => {
  const [emailTemplates, setEmailTemplates] = useState<IEmailTemplate[]>([]);
  const [openEmailTemplateDialog, setOpenEmailTemplateDialog] =
    React.useState<boolean>(false);
  const [emailToEdit, setEmailToEdit] = useState<IEmailTemplate | null>();

  const [openConfirmationDialog, setOpenConfirmationDialog] = useState(false);
  const [emailTemplateToDelete, setEmailTemplateToDelete] =
    useState<number | null>();

  const handleCloseEmailTemplateDialog = () => {
    setOpenEmailTemplateDialog(false);
    setEmailToEdit(null);
  };

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
    fetchEmailTemplates();
  }, [fetchEmailTemplates]);

  const onEditClickHandler = (id: number) => {
    console.log("Edit clicked", id);
    const emailTemplate = emailTemplates.find(
      (emailTemplate) => emailTemplate?.[ETC.EMAILTEMPLATE_ID] === id
    );
    if (emailTemplate) {
      setEmailToEdit(emailTemplate);
      setOpenEmailTemplateDialog(true);
    }
  };

  const onDeleteClickHandler = (id: number) => {
    setEmailTemplateToDelete(id);
    setOpenConfirmationDialog(true);
  };

  const addEmailTemplate = (
    emailTemplate: IEmailTemplate,
    reset?: () => void
  ) => {
    const formattedEmailTemplate = {
      ...emailTemplate,
      email: userEmail,
    };

    axiosInstance
      .post(`${USER_API_URL}/emailtemplate`, formattedEmailTemplate)
      .then(() => {
        toast.success("Modèle d'email ajouté avec succès !");
        fetchEmailTemplates();
        if (reset) reset();
        handleCloseEmailTemplateDialog();
      })
      .catch((error) => {
        console.error(error);
        toast.error(
          "Une erreur s'est produite lors de l'ajout du modèle d'email"
        );
      });
  };

  const updateEmailTemplate = (
    emailTemplate: IEmailTemplate,
    reset?: () => void
  ) => {
    const formattedEmailTemplate = {
      ...emailTemplate,
      userEmail: userEmail,
    };

    axiosInstance
      .put(`${USER_API_URL}/emailtemplate`, formattedEmailTemplate)
      .then(() => {
        toast.success("Modèle d'email modifié avec succès !");
        fetchEmailTemplates();
        handleCloseEmailTemplateDialog();
        if (reset) reset();
      })
      .catch((error) => {
        console.error(error);
        toast.error(
          "Une erreur s'est produite lors de la modification du modèle d'email"
        );
      });
  };

  const deleteEmailTemplate = () => {
    axiosInstance
      .delete(`${USER_API_URL}/emailtemplate/${emailTemplateToDelete}`)
      .then(() => {
        toast.success("Modèle d'email supprimé avec succès !");
        fetchEmailTemplates();
        setOpenConfirmationDialog(false);
      })
      .catch((error) => {
        console.error(error);
        toast.error(
          "Une erreur s'est produite lors de la suppression du modèle d'email"
        );
      });
  }

  return (
    <Box mt={3}>
      <Typography
        sx={{
          fontSize: "1rem",
          fontWeight: 700,
          fontStyle: "normal",
          lineHeight: "1.875rem",
        }}
      >
        Modèles d'email
      </Typography>
      <Box mt={1} mb={2}>
        {/* List of email templates */}
        {emailTemplates.map((emailTemplate, index) => (
          <EmailTemplate
            key={index}
            emailTemplate={emailTemplate}
            onEdit={onEditClickHandler}
            onDelete={onDeleteClickHandler}
          />
        ))}
      </Box>

      <Button
        fullWidth
        variant="outlined"
        color="primary"
        startIcon={<AddIcon />}
        onClick={() => setOpenEmailTemplateDialog(true)}
      >
        Ajouter un modèle
      </Button>

      {openEmailTemplateDialog && (
        <EmailTemplateModal
          open={openEmailTemplateDialog}
          onClose={handleCloseEmailTemplateDialog}
          onAdd={addEmailTemplate}
          onEdit={updateEmailTemplate}
          defaultValues={emailToEdit}
        />
      )}

      {
        openConfirmationDialog && (
          <ConfirmationPopup
            open={openConfirmationDialog}
            onCancel={() => setOpenConfirmationDialog(false)}
            onConfirm={deleteEmailTemplate}
            title="Supprimer le modèle d'email"
            message="Êtes-vous sûr de vouloir supprimer ce modèle d'email ?"
          />
        )
      }
    </Box>
  );
};

export default EmailTemplates;
