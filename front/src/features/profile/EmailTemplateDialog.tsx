import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  DialogActions,
  IconButton,
} from "@mui/material";
import { EditorState, ContentState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { IEmailTemplate } from "../../lib/interfaces/IUser";
import { USER_API_URL } from "../../lib/constants/UserConstants";
import axiosInstance from "../../services/axios";
import { toast } from "react-toastify";
import { convertToRaw } from "draft-js";
/* import draftToHtml from 'draftjs-to-html';
import _ from 'lodash'; */
import { EmailTemplateConstants as ETC } from "../../lib/constants/EmailTemplateConstants";

interface EmailTemplateDialogProps {
  emailTemplateId: number | undefined;
  name: string | undefined;
  content: string | undefined;
  open: boolean;
  isCreate: boolean;
  onClose: () => void;
}

const EmailTemplateDialog: React.FC<EmailTemplateDialogProps> = ({
  emailTemplateId,
  name,
  content,
  open,
  isCreate,
  onClose,
}) => {
  const [emailName, setEmailName] = useState<string>(name || "");
  const [emailContent, setEmailContent] = useState<EditorState>(
    EditorState.createEmpty()
  );

  useEffect(() => {
    setEmailName(name || "");
    const contentState = ContentState.createFromText(content || "");
    const newEditorState = EditorState.createWithContent(contentState);
    setEmailContent(newEditorState);
  }, [name, content]);

  const updateEmailTempalte = () => {
    /*  const rawContentState = convertToRaw(emailContent.getCurrentContent());
    const html = draftToHtml(rawContentState);
    const escapedHtml = _.escape(content); */

    const apiUrl = USER_API_URL + "/emailtemplate";
    const requestBody = {
      [ETC.EMAILTEMPLATE_ID]: emailTemplateId,
      [ETC.EMAILTEMPLATE_NAME]: emailName,
      [ETC.EMAILTEMPLATE_CONTENT]: emailContent
        .getCurrentContent()
        .getPlainText(),
    };

    axiosInstance
      .put(apiUrl, requestBody)
      .then(() => {
        toast.success("template email changé avec succès !");
      })
      .catch((error) => {
        toast.error(
          "Une erreur s'est produite lors de la modification du template email"
        );
      });
  };

  const createEmailTemplate = () => {
    /*  const rawContentState = convertToRaw(emailContent.getCurrentContent());
    const html = draftToHtml(rawContentState);
    const escapedHtml = _.escape(content); */

    const apiUrl = USER_API_URL + "/emailtemplate";
    const requestBody = {
      [ETC.EMAILTEMPLATE_ID]: emailTemplateId,
      [ETC.EMAILTEMPLATE_NAME]: emailName,
      [ETC.EMAILTEMPLATE_CONTENT]: emailContent
        .getCurrentContent()
        .getPlainText(),
      user: { userId: 36 }, // TODO get userID
    };

    axiosInstance
      .post(apiUrl, requestBody)
      .then(() => {
        toast.success("template email cree avec succès !");
      })
      .catch((error) => {
        toast.error(
          "Une erreur s'est produite lors de la creation du template email"
        );
      });
  };

  /*  onSubmit 
  
const rawContentState = convertToRaw(emailContent.getCurrentContent());
const html = draftToHtml(rawContentState);


const escapedHtml = escapeHtmlFunction(html);*/

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
        <Button onClick={onClose} color="primary">
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
