import React, { useEffect, useState } from "react";
import {
  useFormContext,
  useFieldArray,
  useForm,
  FormProvider,
} from "react-hook-form";
import { Box, Button, Grid } from "@mui/material";
import { ClientConstants as CC } from "../../lib/constants/ClientConstants";
import { IClient } from "../../lib/interfaces/IClient";
import { IUser } from "../../lib/interfaces/IUser";
import MuiTextField from "../Form/MuiTextField";
import { UserConstants as UC } from "../../lib/constants/UserConstants";
import { createEmptyClientUser } from "../../utils/utils";
import { userSchema } from "../../features/clients/ClientDetails";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import axiosInstance from "../../services/axios";
import Loading from "../utils/Loading";
import { useNavigate } from "react-router-dom";

export const USER_API_URL = "/api/user";

interface ClientUsersProps {
  getClient: (clientId: number) => void;
}
function ClientUsers({ getClient }: ClientUsersProps) {
  const {
    control,
    formState: { errors },
    watch,
  } = useFormContext<IClient>();
  const { fields } = useFieldArray({
    control,
    name: CC.CLIENT_USERS,
  });
  const [loading, setLoading] = useState(false);

  const getUserInitialValues = (): IUser => {
    const existingUser = fields[0];
    if (existingUser) {
      return existingUser;
    }
    return createEmptyClientUser();
  };

  const methods = useForm<IUser>({
    resolver: yupResolver(userSchema),
    defaultValues: getUserInitialValues(),
  });

  // reset user form when client users change
  useEffect(() => {
    methods.reset(getUserInitialValues());
  }, [fields]);

  const isNewUser = methods.watch(UC.USER_ID) === undefined;

  const formatUserForAdd = (data: IUser) => {
    return {
      [CC.CLIENT_ID]: watch(CC.CLIENT_ID),
      [UC.USER_FIRSTNAME]: data[UC.USER_FIRSTNAME],
      [UC.USER_LASTNAME]: data[UC.USER_LASTNAME],
      [UC.USER_EMAIL]: data[UC.USER_EMAIL],
      [UC.USER_PHONE]: data[UC.USER_PHONE],
    };
  };

  const formatUserForUpdate = (data: IUser) => {
    return {
      [UC.USER_FIRSTNAME]: data[UC.USER_FIRSTNAME],
      [UC.USER_LASTNAME]: data[UC.USER_LASTNAME],
      [UC.USER_EMAIL]: data[UC.USER_EMAIL],
      [UC.USER_PHONE]: data[UC.USER_PHONE],
    };
  };

  const addUserClickHandler = (data: IUser) => {
    //check if thers is no error
    const hasNoErrors = Object.keys(methods.formState.errors).length === 0;
    if (hasNoErrors) {
      const formattedData = formatUserForAdd(data);
      setLoading(true);
      axiosInstance
        .post(`${USER_API_URL}/add`, formattedData)
        .then((response) => {
          toast.success("Utilisateur ajouté avec succès");
          //refresh the page
          getClient(Number(watch(CC.CLIENT_ID)));
        })
        .catch((error) => {
          // check if the response code is 409 then the user already exists with the same email
          if (error.response.status === 409) {
            toast.error("Un utilisateur existe déjà avec cet email");
          } else {
            toast.error("Erreur lors de l'ajout de l'utilisateur");
          }
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const updateUserClickHandler = (data: IUser) => {
    //check if thers is no error
    const hasNoErrors = Object.keys(methods.formState.errors).length === 0;
    if (hasNoErrors) {
      const formattedData = formatUserForUpdate(data);
      setLoading(true);
      axiosInstance
        .put(`${USER_API_URL}/`, formattedData)
        .then((response) => {
          toast.success("Utilisateur modifié avec succès");
          //refresh the page
          getClient(Number(watch(CC.CLIENT_ID)));
        })
        .catch((error) => {
          toast.error("Erreur lors de la modification de l'utilisateur");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const deleteUserClickHandler = () => {
    // get user email from the client form
    const { [UC.USER_EMAIL]: userEmail } = fields[0];

    setLoading(true);
    axiosInstance
      .put(`${USER_API_URL}/delete`, {
        username: userEmail,
      })
      .then((response) => {
        toast.success("Utilisateur supprimé avec succès");
        //refresh the page
        getClient(Number(watch(CC.CLIENT_ID)));
      })
      .catch((error) => {
        toast.error("Erreur lors de la suppression de l'utilisateur");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <Box
      sx={{
        p: 2,
        backgroundColor: "#FFFFFF",
        borderRadius: "8px",
        overflow: "hidden",
      }}
    >
      <FormProvider {...methods}>
        <Box px={"1.5rem"} py={"0.75rem"}>
          <Grid container rowSpacing={4}>
            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <MuiTextField
                    name={UC.USER_LASTNAME}
                    label="Nom"
                    placeholder="Nom"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <MuiTextField
                    name={UC.USER_FIRSTNAME}
                    label="Prénom"
                    placeholder="Prénom"
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <MuiTextField
                    name={UC.USER_EMAIL}
                    label="Email"
                    placeholder="Email"
                    disabled={!isNewUser}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <MuiTextField
                    name={UC.USER_PHONE}
                    label="Numéro de téléphone"
                    placeholder="0033*********"
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} display={"flex"} justifyContent={"flex-end"}>
              {isNewUser ? (
                <Button
                  color="primary"
                  onClick={methods.handleSubmit((data) =>
                    addUserClickHandler(data)
                  )}
                >
                  Ajouter l'utilisateur
                </Button>
              ) : (
                <>
                  <Button
                    color="primary"
                    onClick={methods.handleSubmit((data) =>
                      updateUserClickHandler(data)
                    )}
                  >
                    Modifier l'utilisateur
                  </Button>
                  <Button color="error" onClick={deleteUserClickHandler}>
                    Supprimer l'utilisateur
                  </Button>
                </>
              )}
            </Grid>
          </Grid>
        </Box>
      </FormProvider>
    </Box>
  );
}

export default ClientUsers;
