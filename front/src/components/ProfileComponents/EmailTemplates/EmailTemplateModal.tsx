import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  DialogActions,
  Typography,
  Box,
  Divider,
  Grid,
} from "@mui/material";
import { useForm, Controller, FormProvider } from "react-hook-form";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import WYSIWYGEditor from "../../Form/WYSIWYGEditor";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { EmailTemplateConstants as ETC } from "../../../lib/constants/EmailTemplateConstants";
import { IEmailTemplate } from "../../../lib/interfaces/IUser";
import MuiTextField from "../../Form/MuiTextField";
import AttachEmailOutlinedIcon from "@mui/icons-material/AttachEmailOutlined";

const schema = yup
  .object({
    [ETC.EMAILTEMPLATE_NAME]: yup
      .string()
      .required("Le nom du template est requis"),
    [ETC.EMAILTEMPLATE_CONTENT]: yup
      .string()
      .required("Le contenu est requis")
      .max(150, "Le contenu ne doit pas dépasser 150 caractères"),
  })
  .required();

interface EmailTemplateModalProps {
  open: boolean;
  onClose: () => void;
  defaultValues?: IEmailTemplate | null;
  onAdd?: (data: IEmailTemplate, callback?: () => void) => void;
  onEdit?: (data: IEmailTemplate, callback?: () => void) => void;
}

const EmailTemplateModal: React.FC<EmailTemplateModalProps> = ({
  open,
  onClose,
  defaultValues,
  onAdd,
  onEdit,
}) => {
  const methods = useForm<IEmailTemplate>({
    resolver: yupResolver(schema),
    defaultValues: {
      [ETC.EMAILTEMPLATE_NAME]: "",
      [ETC.EMAILTEMPLATE_CONTENT]: "",
    },
  });
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = methods;
  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues);
    }
  }, [defaultValues, reset]);

  const onSubmit = (data: IEmailTemplate) => {
    console.log(data);
    if (defaultValues) {
      // If defaultValues exists, it means we are editing an existing template
      // So we call the onEdit function and pass the data to
      // the parent component
      if (onEdit) {
        onEdit(data, reset);
      }
    } else {
      // If defaultValues does not exist, it means we are creating a new template
      // So we call the onAdd function and pass the data to the parent component
      if (onAdd) {
        onAdd(data, reset);
      }
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          style={{ backgroundColor: "white" }}
        >
          <DialogTitle>
            <Grid container alignItems={"center"} spacing={2}>
              <Grid item sx={{ mt: "1.125rem", color: "#157EB5" }}>
                <AttachEmailOutlinedIcon fontSize="large" />
              </Grid>
              <Grid item>
                {defaultValues ? "Éditer" : "Ajouter"} un template d'Email
              </Grid>
            </Grid>
          </DialogTitle>
          <Divider /> {/* Divider between title and content */}
          <DialogContent>
            <Box>
              <MuiTextField
                name={ETC.EMAILTEMPLATE_NAME}
                label="Titre du template"
                placeholder="Titre du template"
              />
            </Box>
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
              <Controller
                render={({ field: { onChange, value } }) => (
                  <WYSIWYGEditor
                    onChange={onChange}
                    value={value} // Pass the HTML value here
                  />
                )}
                name={ETC.EMAILTEMPLATE_CONTENT}
                control={control}
                defaultValue=""
              />
              {errors?.[ETC.EMAILTEMPLATE_CONTENT] && (
                <p style={{
                    color: "red",
                    fontSize: "0.75rem",
                    marginLeft: "0.5rem",
                    
                }}>{errors[ETC.EMAILTEMPLATE_CONTENT].message}</p>
              )}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose}>Annuler</Button>
            <Button type="submit">Enregistrer</Button>
          </DialogActions>
        </form>
      </FormProvider>
    </Dialog>
  );
};

export default EmailTemplateModal;
