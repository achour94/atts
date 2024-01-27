import { Avatar, Box, Stack } from "@mui/material";
import React from "react";
import MuiButton from "../../components/Form/MuiButton";
import EditIcon from "@mui/icons-material/Edit";
import ClientAvatarCoverImage from "../../assets/images/ClientAvatarCover.png";
import { UserConstants as UC } from "../../lib/constants/UserConstants";
import { EmailTemplateConstants as ETC } from "../../lib/constants/EmailTemplateConstants";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import UserService from "../../services/UserService";
import { IEmailTemplate, IUser } from "../../lib/interfaces/IUser";
import { useForm } from "react-hook-form";

// Email Template Schema
export const emailTemplateSchema = yup.object({
  [ETC.EMAILTEMPLATE_ID]: yup.number().optional().typeError("L'ID doit être un nombre"),
  [ETC.EMAILTEMPLATE_NAME]: yup.string().required("Le nom est requis"),
  [ETC.EMAILTEMPLATE_CONTENT]: yup.string().required("Le contenu est requis"),
});

// User Schema
export const userSchema = yup.object({
  [UC.USER_ID]: yup.number().optional().typeError("L'ID doit être un nombre"),
  [UC.USER_FIRSTNAME]: yup.string().required("Le prénom est requis"),
  [UC.USER_LASTNAME]: yup.string().required("Le nom est requis"),
  [UC.USER_EMAIL]: yup.string().email("Doit être un email valide").required("L'email est requis"),
  [UC.USER_PHONE]: yup.string().required("Le téléphone est requis"),
  [UC.USER_PASSWORD]: yup.string().required("Le mot de passe est requis"),
  [UC.USER_EMAILTEMPLATES]: yup.array().of(emailTemplateSchema),
});

function Profile() {

  //get connected user informations
  const user = UserService.getTokenParsed();
  console.log(user);

  const initialValues = {
    [UC.USER_ID]: undefined,
    [UC.USER_FIRSTNAME]: '',
    [UC.USER_LASTNAME]: '',
    [UC.USER_EMAIL]: '',
    [UC.USER_PHONE]: '',
    [UC.USER_PASSWORD]: "",
    [UC.USER_EMAILTEMPLATES]: [] as IEmailTemplate[],
  };

  const methods = useForm({
    resolver: yupResolver(userSchema),
    defaultValues: initialValues,
  });

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
          <Stack direction="row" spacing={2} justifyContent={"flex-end"}>
            <MuiButton
              type="submit"
              color="primary"
              startIcon={<EditIcon />}
              label="Modifier"
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
      </Box>
    </Box>
  );
}

export default Profile;
