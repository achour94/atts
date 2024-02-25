import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  DialogActions,
} from "@mui/material";
import { EditorState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { USER_API_URL } from "../../lib/constants/UserConstants";
import axiosInstance from "../../services/axios";
import { toast } from "react-toastify";
import { EmailTemplateConstants as ETC } from "../../lib/constants/EmailTemplateConstants";
import {
  convertEditorStateToText,
  convertTextToEditorState,
} from "../../utils/utils";

interface EmailTemplateDialogProps {
  emailTemplateId: number | undefined;
  name: string | undefined;
  content: string | undefined;
  userId: number | undefined;
  open: boolean;
  isCreate: boolean;
  onClose: () => void;
  fetchEmailTemplates: () => void;
}

const EmailTemplateDialog: React.FC<EmailTemplateDialogProps> = ({
  emailTemplateId,
  name,
  content,
  userId,
  open,
  isCreate,
  onClose,
  fetchEmailTemplates,
}) => {
  const [emailName, setEmailName] = useState<string | undefined>(name || "");
  const [emailContent, setEmailContent] = useState<EditorState>(
    EditorState.createEmpty()
  );

  useEffect(() => {
    setEmailName(name || "");
    setEmailContent(convertTextToEditorState(content || ""));
  }, [name, content]);

  const updateEmailTempalte = () => {
    const apiUrl = USER_API_URL + "/emailtemplate";
    const requestBody = {
      [ETC.EMAILTEMPLATE_ID]: emailTemplateId,
      [ETC.EMAILTEMPLATE_NAME]: emailName,
      [ETC.EMAILTEMPLATE_CONTENT]: convertEditorStateToText(emailContent),
      user: { userId: userId },
    };

    axiosInstance
      .put(apiUrl, requestBody)
      .then(() => {
        toast.success("template email changé avec succès !");
        hundleClose();
        fetchEmailTemplates();
      })
      .catch((error) => {
        toast.error(
          "Une erreur s'est produite lors de la modification du template email"
        );
      });
  };

  const hundleClose = () => {
    onClose();
    setEmailName(undefined);
    setEmailContent(EditorState.createEmpty());
  };

  const createEmailTemplate = () => {

    const apiUrl = USER_API_URL + "/emailtemplate";
    const requestBody = {
      [ETC.EMAILTEMPLATE_ID]: emailTemplateId,
      [ETC.EMAILTEMPLATE_NAME]: emailName,
      [ETC.EMAILTEMPLATE_CONTENT]: convertEditorStateToText(emailContent),
      user: { userId: userId },
    };

    axiosInstance
      .post(apiUrl, requestBody)
      .then(() => {
        toast.success("template email cree avec succès !");
        hundleClose();
        fetchEmailTemplates();
      })
      .catch((error) => {
        toast.error(
          "Une erreur s'est produite lors de la creation du template email"
        );
      });
  };

  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">
        Ajouter un template d'Email
      </DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="titre"
          label="Titre du template"
          type="text"
          fullWidth
          value={emailName}
          onChange={(e) => setEmailName(e.target.value)}
        />
        <Editor
          editorState={emailContent}
          onEditorStateChange={setEmailContent}
          toolbar={{
            options: [
              "inline",
              "fontSize",
              "fontFamily",
              "list",
              "textAlign",
              "history",
            ],
            inline: {
              options: ["bold", "italic", "underline", "strikethrough"],
            },
            fontSize: {
              options: [10, 12, 14, 16, 18, 20, 24, 30, 36, 48, 60, 72, 96],
            },
            fontFamily: {
              options: [
                "Arial",
                "Georgia",
                "Impact",
                "Tahoma",
                "Times New Roman",
                "Verdana",
              ],
            },
            textAlign: {
              inDropdown: true,
              options: ["left", "center", "right", "justify"],
            },
          }}
          editorStyle={{
            backgroundColor: "#fff",
            padding: "0 10px",
            minHeight: "200px",
            maxHeight: "auto",
            overflow: "auto",
            border: "1px solid #ddd",
            borderRadius: "4px",
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={hundleClose} color="primary">
          Annuler
        </Button>
        <Button
          onClick={() => {
            isCreate ? createEmailTemplate() : updateEmailTempalte();
          }}
          color="primary"
        >
          Enregistrer
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EmailTemplateDialog;
