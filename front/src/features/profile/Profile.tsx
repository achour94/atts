import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import MuiButton from "../../components/Form/MuiButton";
import { Edit, Close, ExpandCircleDownOutlined } from "@mui/icons-material";
import ClientAvatarCoverImage from "../../assets/images/ClientAvatarCover.png";
import {
  UserConstants as UC,
  USER_API_URL,
} from "../../lib/constants/UserConstants";
import { EmailTemplateConstants as ETC } from "../../lib/constants/EmailTemplateConstants";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import UserService from "../../services/UserService";
import { IEmailTemplate, IUser } from "../../lib/interfaces/IUser";
import { FormProvider, useForm } from "react-hook-form";
import MuiTextField from "../../components/Form/MuiTextField";
import ChangePasswordForm from "./ChangePasswordForm";
import axiosInstance from "../../services/axios";
import { toast } from "react-toastify";
import { userInfo } from "os";
import { formatClientUserData } from "../../utils/utils";
import { KeycloakProfile } from "keycloak-js";
import MailTemplate from "./TemplateEmail";

// Email Template Schema
export const emailTemplateSchema = yup.object({
  [ETC.EMAILTEMPLATE_ID]: yup
    .number()
    .optional()
    .typeError("L'ID doit être un nombre"),
  [ETC.EMAILTEMPLATE_NAME]: yup.string().required("Le nom est requis"),
  [ETC.EMAILTEMPLATE_CONTENT]: yup.string().required("Le contenu est requis"),
});

// User Schema
export const userSchema = yup.object({
  [UC.USER_ID]: yup.number().optional().typeError("L'ID doit être un nombre"),
  [UC.USER_FIRSTNAME]: yup.string().required("Le prénom est requis"),
  [UC.USER_LASTNAME]: yup.string().required("Le nom est requis"),
  [UC.USER_EMAIL]: yup
    .string()
    .email("Doit être un email valide")
    .required("L'email est requis"),
  [UC.USER_PHONE]: yup.string().required("Le téléphone est requis"),
  [UC.USER_PASSWORD]: yup.string().required("Le mot de passe est requis"),
  [UC.USER_EMAILTEMPLATES]: yup.array().of(emailTemplateSchema),
});

function Profile() {
  const [userInfosKeyCloak, setUserInfosKeyCloak] =
    useState<KeycloakProfile | null>(null);

  //get connected user informations
  useEffect(() => {
    UserService.getUserInfo()
      .then((userInfo) => setUserInfosKeyCloak(userInfo))
      .catch(() => toast.error("erreur getting infos from keycloak"));
  }, []);

  const [open, setOpen] = useState(false);
  const [modificationDisabled, setModificationDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const initialValues = {
    [UC.USER_ID]: undefined,
    [UC.USER_FIRSTNAME]: "",
    [UC.USER_LASTNAME]: "",
    [UC.USER_EMAIL]: "",
    [UC.USER_PHONE]: "",
    [UC.USER_PASSWORD]: "",
    [UC.USER_EMAILTEMPLATES]: [] as IEmailTemplate[],
  };

  const methods = useForm({
    resolver: yupResolver(userSchema),
    defaultValues: initialValues,
  });

  const watchAllFields = methods.watch();

  const handleClose = () => {
    setOpen(false);
  };

  const handleModification = () => {
    setModificationDisabled(!modificationDisabled)
  }

  const getUser = (email: string): void => {
    setLoading(true);
    axiosInstance
      .get(`${USER_API_URL}/${email}`)
      .then((response) => {
        const user: IUser = formatClientUserData(response.data);

        methods.reset(user);
      })
      .catch((error) => {
        console.log(error);
        toast.error("Error get user information");
      })
      .finally(() => {
        setLoading(false);
      });
  };


  const updateUserInfo = () => {
    setLoading(true);

    const requestBody = {
      [UC.USER_FIRSTNAME]: watchAllFields?.[UC.USER_FIRSTNAME],
      [UC.USER_LASTNAME]: watchAllFields?.[UC.USER_LASTNAME],
      [UC.USER_EMAIL]: watchAllFields?.[UC.USER_EMAIL],
      [UC.USER_PHONE]: watchAllFields?.[UC.USER_PHONE],
    };

    axiosInstance
      .put(USER_API_URL + '/', requestBody)
      .then(() => {
        toast.success("Les informations ont été modifié avec succès !");
      })
      .catch((error) => {
        
      })
      .finally(() => {
        setLoading(false);
        setModificationDisabled(true);
      });
  };

  useEffect(() => {
    if (userInfosKeyCloak?.email) {
      getUser(userInfosKeyCloak?.email);
    }
  }, [userInfosKeyCloak]);

  const resetPassword = {
    endAdornment: (
      <div>
        <Button
          sx={{
            height: "100%",
            width: "250px",
            borderRadius: 0,
            boxShadow: "none",
            color: "orange",
          }}
          onClick={() => {
            setOpen(true);
          }}
        >
          CHANGER LE MOT DE PASSE
        </Button>

        {/* TODO Move it in resetPasswordDialog component*/}
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">
            <IconButton
              aria-label="close"
              onClick={handleClose}
              sx={{
                position: "absolute",
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <Close />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <ChangePasswordForm />
          </DialogContent>
        </Dialog>
      </div>
    ),
  };

  return (
    <FormProvider {...methods}>
      <Box
        sx={{
          backgroundColor: "#FFFFFF",
          borderRadius: "0.75rem",
          border: "1px solid #EAEEF4",
          width: "100%",
          height: "fit-content",
          p: 2,
          mt: 2,
        }}
      >
        <Box>
          <Box>
            <Stack direction="row" spacing={2} justifyContent={"flex-end"}>
              <MuiButton
                type="submit"
                color="primary"
                startIcon={<Edit />}
                label="Modifier"
                onClick={() => handleModification()}
              />
            </Stack>
          </Box>

          <Box>
            <Stack marginTop="1.25rem">
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  backgroundImage: `url(${ClientAvatarCoverImage})`,
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  borderRadius: "0.5rem",
                  width: "100%",
                  height: "7.8125rem",
                }}
              >
                <Avatar
                  alt="User avatar"
                  // src="https://material-ui.com/static/images/avatar/1.jpg"
                  sx={{
                    height: "6.25rem",
                    width: "6.25rem",
                    ml: "1.5rem",
                  }}
                />
              </Box>
            </Stack>
          </Box>

          <Box sx={{ width: "100%", margin: "auto", marginTop: "10px" }}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <MuiTextField
                  name={`${UC.USER_FIRSTNAME}`}
                  label="Prénom"
                  placeholder="Prénom"
                  disabled={modificationDisabled}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <MuiTextField
                  name={`${UC.USER_LASTNAME}`}
                  label="Nom"
                  placeholder="Nom"
                  disabled={modificationDisabled}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <MuiTextField
                  name={`${UC.USER_EMAIL}`}
                  label="Email"
                  placeholder="Email"
                  disabled={modificationDisabled}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <MuiTextField
                  name={`${UC.USER_PHONE}`}
                  label="Numéro de téléphone"
                  placeholder="0033*********"
                  disabled={modificationDisabled}
                />
              </Grid>
              <Grid item xs={12}>
                <MuiTextField
                  name={`${UC.USER_PASSWORD}`}
                  label="Mot de passe"
                  placeholder="Mot de passe"
                  type="password"
                  inputProps={resetPassword}
                  disabled={modificationDisabled}
                />
              </Grid>
            </Grid>
            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
              <MuiButton
                sx={{ display: modificationDisabled ? 'none' : 'inline-flex' }}
                label="Valider"
                type="submit"
                variant="contained"
                color="primary"
                onClick={updateUserInfo}
              />
            </Box>
            <MailTemplate/>
          </Box>
        </Box>
      </Box>
    </FormProvider>
  );
}

export default Profile;
