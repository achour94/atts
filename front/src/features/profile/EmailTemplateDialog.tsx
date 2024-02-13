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

interface EmailTemplateDialogProps {
  name?: string;
  content?: string;
  open: boolean;
  onClose: () => void;
}

const EmailTemplateDialog: React.FC<EmailTemplateDialogProps> = ({
  name = "",
  content = "",
  open,
  onClose,
}) => {
  const [titre, setTitre] = useState<string>("");
  const [emailContent, setEmailContent] = useState<EditorState>(
    EditorState.createEmpty()
  );

  useEffect(() => {
    const contentState = ContentState.createFromText(content);
    const newEditorState = EditorState.createWithContent(contentState);
    setEmailContent(newEditorState);
  }, [content]);

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
          value={name}
          onChange={(e) => setTitre(e.target.value)}
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
            /* handle save logic */
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
