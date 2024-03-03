import { Box, Button, Grid, Stack, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import MuiButton from "../../components/Form/MuiButton";
import { Edit } from "@mui/icons-material";
import {
  UserConstants as UC,
  USER_API_URL,
} from "../../lib/constants/UserConstants";
import { EmailTemplateConstants as ETC } from "../../lib/constants/EmailTemplateConstants";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import UserService from "../../services/UserService";
import { IUser } from "../../lib/interfaces/IUser";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import MuiTextField from "../../components/Form/MuiTextField";
import axiosInstance from "../../services/axios";
import { toast } from "react-toastify";
import { formatClientUserData } from "../../utils/utils";
import { KeycloakProfile } from "keycloak-js";
import ClientAvatar from "../../components/ClientForms/ClientAvatar";
import PasswordModificationDialog from "../../components/ProfileComponents/PasswordModification/PasswordModificationDialog";
import EmailTemplates from "../../components/ProfileComponents/EmailTemplates/EmailTemplates";

// User Schema
export const userSchema = yup.object({
  [UC.USER_FIRSTNAME]: yup.string().required("Le prénom est requis"),
  [UC.USER_LASTNAME]: yup.string().required("Le nom est requis"),
  [UC.USER_EMAIL]: yup
    .string()
    .email("Doit être un email valide")
    .required("L'email est requis"),
  [UC.USER_PHONE]: yup.string().required("Le téléphone est requis"),
});

function Profile() {
  const [userInfosKeyCloak, setUserInfosKeyCloak] =
    useState<KeycloakProfile | null>(null);

  //get connected user informations
  useEffect(() => {
    UserService.getUserProfile()
      .then((userInfo) => setUserInfosKeyCloak(userInfo))
      .catch(() =>
        toast.error(
          "Une erreur s'est produite lors de la récupération des informations de l'utilisateur"
        )
      );
  }, []);

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const initialValues = {
    [UC.USER_FIRSTNAME]: "",
    [UC.USER_LASTNAME]: "",
    [UC.USER_EMAIL]: "",
    [UC.USER_PHONE]: "",
  };

  const methods = useForm({
    resolver: yupResolver(userSchema),
    defaultValues: initialValues,
  });

  const handleClose = () => {
    setOpen(false);
  };

  const fetchUser = (email: string): void => {
    setLoading(true);
    axiosInstance
      .get(`${USER_API_URL}/${email}`)
      .then((response) => {
        const user: IUser = formatClientUserData(response.data);

        const userFormValues = {
          [UC.USER_FIRSTNAME]: user?.[UC.USER_FIRSTNAME],
          [UC.USER_LASTNAME]: user?.[UC.USER_LASTNAME],
          [UC.USER_EMAIL]: user?.[UC.USER_EMAIL],
          [UC.USER_PHONE]: user?.[UC.USER_PHONE],
        };
        methods.reset(userFormValues);
      })
      .catch((error) => {
        console.log(error);
        toast.error(
          "Une erreur s'est produite lors de la récupération des informations de l'utilisateur"
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (userInfosKeyCloak?.email) {
      fetchUser(userInfosKeyCloak?.email);
    }
  }, [userInfosKeyCloak]);

  const onSubmit: SubmitHandler<any> = (data) => {
    const formattedData = {
      [UC.USER_FIRSTNAME]: data?.[UC.USER_FIRSTNAME],
      [UC.USER_LASTNAME]: data?.[UC.USER_LASTNAME],
      [UC.USER_EMAIL]: data?.[UC.USER_EMAIL],
      [UC.USER_PHONE]: data?.[UC.USER_PHONE],
    };

    axiosInstance
      .put(USER_API_URL + "/", formattedData)
      .then(() => {
        toast.success("Les informations ont été modifié avec succès !");
      })
      .catch((error) => {
        toast.error(
          "Une erreur s'est produite lors de la modification des informations"
        );
      });
  };

  return (
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
          <ClientAvatar />
        </Box>

        <Box px={"1.5rem"} py={"0.75rem"}>
          <Box>
            <FormProvider {...methods}>
              <form onSubmit={methods.handleSubmit(onSubmit)}>
                <Box>
                  <Grid container rowSpacing={4}>
                    <Grid item xs={12}>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <MuiTextField
                            name={`${UC.USER_FIRSTNAME}`}
                            label="Prénom"
                            placeholder="Prénom"
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <MuiTextField
                            name={`${UC.USER_LASTNAME}`}
                            label="Nom"
                            placeholder="Nom"
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item xs={12}>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <MuiTextField
                            name={`${UC.USER_EMAIL}`}
                            label="Email"
                            placeholder="Email"
                            disabled={true}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <MuiTextField
                            name={`${UC.USER_PHONE}`}
                            label="Numéro de téléphone"
                            placeholder="0033*********"
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item xs={12}>
                      <Box>
                        <Stack
                          direction="row"
                          spacing={2}
                          justifyContent={"flex-end"}
                        >
                          <MuiButton
                            type="submit"
                            color="primary"
                            startIcon={<Edit />}
                            label="Modifier"
                            disabled={!methods.formState.isDirty}
                          />
                        </Stack>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </form>
            </FormProvider>
          </Box>

          <Box
            sx={{
              width: "100%",
            }}
          >
            <Typography
              sx={{
                fontSize: "1rem",
                fontWeight: 700,
                fontStyle: "normal",
                lineHeight: "1.875rem",
              }}
            >
              Mot de passe
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              placeholder={"**********"}
              sx={{
                mt: "0.75rem",
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "#EAEEF4", // Default border color
                  },
                },
              }}
              type={"password"}
              disabled={true}
              InputProps={{
                endAdornment: (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <Button
                      sx={{
                        whiteSpace: "nowrap",
                      }}
                      color="warning"
                      onClick={() => {
                        setOpen(true);
                      }}
                    >
                      CHANGER LE MOT DE PASSE
                    </Button>
                  </Box>
                ),
              }}
            />
          </Box>

          <EmailTemplates userEmail={userInfosKeyCloak?.email || ""} />

          <PasswordModificationDialog open={open} onClose={handleClose} />
        </Box>
      </Box>
    </Box>
  );
}

export default Profile;
