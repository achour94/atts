import React, { useEffect, useState } from "react";
import { Box, Grid, Icon, IconButton, Tab } from "@mui/material";
import { ArrowBackIos, GroupOutlined } from "@mui/icons-material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import BarChartIcon from "@mui/icons-material/BarChart";
import ClientInformations from "../../components/ClientForms/ClientInformations";
import { IClient, ISubscription } from "../../lib/interfaces/IClient";
import { ClientConstants as CC } from "../../lib/constants/ClientConstants";
import { UserConstants as UC } from "../../lib/constants/UserConstants";
import { EmailTemplateConstants as ETC } from "../../lib/constants/EmailTemplateConstants";
import { SubmitHandler, FormProvider, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import ClientActions from "../../components/ClientForms/ClientActions";
import ClientSubscriptions from "../../components/ClientForms/ClientSubscriptions";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../services/axios";
import { CLIENT_API_URL } from "./clientSlice";
import { formatClientData } from "../../utils/utils";
import { toast } from "react-toastify";
import { IUser } from "../../lib/interfaces/IUser";
import ClientUsers from "../../components/ClientForms/ClientUsers";

// Subscription Schema
export const subscriptionSchema = yup.object({
  [CC.CLIENT_SUBSCRIPTION_ID]: yup
    .number()
    .optional()
    .typeError("L'ID doit être un nombre"),
  [CC.CLIENT_SUBSCRIPTION_NAME]: yup
    .string()
    .required("Le nom de l'abonnement est requis"),
  [CC.CLIENT_SUBSCRIPTION_DATA]: yup
    .string()
    .required("Les données de l'abonnement sont requises"),
  [CC.CLIENT_SUBSCRIPTION_PRICE]: yup
    .number()
    .required("Le prix de l'abonnement est requis")
    .typeError("Le prix doit être un nombre"),
});

// User Schema
export const userSchema = yup.object({
  [UC.USER_ID]: yup.number().optional().typeError("L'ID doit être un nombre"),
  [UC.USER_FIRSTNAME]: yup.string().required("Le prénom est requis"),
  [UC.USER_LASTNAME]: yup.string().required("Le nom est requis"),
  [UC.USER_EMAIL]: yup.string().email("Doit être un email valide").required("L'email est requis"),
  [UC.USER_PHONE]: yup.string().required("Le téléphone est requis"),
});

// Client Schema
export const clientSchema = yup.object({
  [CC.CLIENT_ID]: yup.number().optional().typeError("L'ID doit être un nombre"),
  [CC.CLIENT_CLIENTREFERENCE]: yup
    .string()
    .required("La référence client est requise"),
  [CC.CLIENT_DEFAULTSUBSCRIPTION]: yup
    .number()
    .optional()
    .typeError("L'abonnement par défaut doit être un nombre"),
  [CC.CLIENT_DIVERSESUBSCRIPTION]: yup
    .number()
    .optional()
    .typeError("L'abonnement divers doit être un nombre"),
  [CC.CLIENT_ACTIVEDIVERSE]: yup.boolean().typeError("Doit être un booléen"),
  [CC.CLIENT_NAME]: yup.string().required("Le nom est requis"),
  [CC.CLIENT_ADDRESS]: yup.string().required("L'adresse est requise"),
  [CC.CLIENT_CITY]: yup.string().required("La ville est requise"),
  [CC.CLIENT_POSTALCODE]: yup.string().required("Le code postal est requis"),
  [CC.CLIENT_EMAIL]: yup.string().email("Doit être un email valide").required(),
  [CC.CLIENT_PHONE]: yup.string().required("Le téléphone est requis"),
  [CC.CLIENT_SUBSCRIPTIONS]: yup.array().of(subscriptionSchema).optional(),
  [CC.CLIENT_USERS]: yup.array().of(userSchema).optional(),
});

function ClientDetails() {
  // id could be 'add' or a number
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("informations");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: string) => {
    setActiveTab(newValue);
  };

  const isAddMode = id === "add";

  const goBack = () => {
    navigate("/clients");
  };
  // Define initial form values
  const initialValues = {
    // Example initial values. Adjust based on your actual data structure
    [CC.CLIENT_ID]: undefined,
    [CC.CLIENT_CLIENTREFERENCE]: "",
    [CC.CLIENT_DEFAULTSUBSCRIPTION]: 0,
    [CC.CLIENT_DIVERSESUBSCRIPTION]: 0,
    [CC.CLIENT_POSTALCODE]: "",
    [CC.CLIENT_ACTIVEDIVERSE]: false,
    [CC.CLIENT_NAME]: "",
    [CC.CLIENT_ADDRESS]: "",
    [CC.CLIENT_CITY]: "",
    [CC.CLIENT_PHONE]: "",
    [CC.CLIENT_EMAIL]: "",
    [CC.CLIENT_SUBSCRIPTIONS]: [] as ISubscription[],
    [CC.CLIENT_USERS]: [] as IUser[],
  };
  const methods = useForm({
    resolver: yupResolver(clientSchema),
    defaultValues: initialValues,
  });

  const getClient = (id: number): void => {
    setLoading(true);
    axiosInstance
      .get(`${CLIENT_API_URL}/${id}`)
      .then((response) => {
        const client: IClient = formatClientData(response.data);
        methods.reset(client);
      })
      .catch((error) => {
        console.log(error);
        toast.error("Erreur lors de la récupération du client");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (id && !isAddMode) getClient(parseInt(id));
  }, [id]);

  const deleteClient = (): void => {
    setLoading(true);
    axiosInstance
      .delete(`${CLIENT_API_URL}/${id}`)
      .then((response) => {
        toast.success("Client supprimé avec succès");
        goBack();
      })
      .catch((error) => {
        console.log(error);
        toast.error("Erreur lors de la suppression du client");
      })
      .finally(() => {
        setLoading(false);
      });
  }

  const updateClient = (client: IClient): void => {
    setLoading(true);
    axiosInstance
      .put(`${CLIENT_API_URL}`, client)
      .then((response) => {
        toast.success("Client modifié avec succès");
      })
      .catch((error) => {
        console.log(error);
        toast.error("Erreur lors de la modification du client");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const addClient = (client: IClient): void => {
    setLoading(true);
    axiosInstance
      .post(`${CLIENT_API_URL}`, client)
      .then((response) => {
        toast.success("Client ajouté avec succès");
      })
      .catch((error) => {
        console.log(error);
        toast.error("Erreur lors de l'ajout du client");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const onSubmit: SubmitHandler<any> = (data) => {
    console.log(data);
    console.log(methods.formState.errors);
    //check if thers is no error
    const hasNoErrors = Object.keys(methods.formState.errors).length === 0;
    if (hasNoErrors) {
      console.log("no error");
      const formattedClient = {
        ...data,
        [CC.CLIENT_SUBSCRIPTIONS]: data[CC.CLIENT_SUBSCRIPTIONS].map(
          (subscription: ISubscription) => {
            // remove [CC.CLIENT_SUBSCRIPTION_ID] and replace it with id and remove [CC.CLIENT_SUBSCRIPTION_NAME] and replace it with name
            return {
              id: subscription[CC.CLIENT_SUBSCRIPTION_ID],
              name: subscription[CC.CLIENT_SUBSCRIPTION_NAME],
              data: subscription[CC.CLIENT_SUBSCRIPTION_DATA],
              price: subscription[CC.CLIENT_SUBSCRIPTION_PRICE],
            };
          }
        ),
        [CC.CLIENT_USERS]: [],
      };
      if (isAddMode) addClient(formattedClient);
      else updateClient(formattedClient);
    }
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
        mt: 2
      }}
    >
      <Box>
        <IconButton onClick={goBack}>
          <ArrowBackIos />
        </IconButton>
      </Box>
      <Box>
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <Box>
              <ClientActions isAddMode={isAddMode} onDelete={deleteClient} />
            </Box>
            <Box>
              <TabContext value={activeTab}>
                <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                  <TabList
                    onChange={handleTabChange}
                    aria-label="lab API tabs example"
                  >
                    <Tab
                      label="INFORMATIONS"
                      value="informations"
                      icon={<InfoOutlinedIcon />}
                      iconPosition="start"
                    />
                    <Tab
                      label="FORFAITS"
                      value="subscriptions"
                      icon={<BarChartIcon />}
                      iconPosition="start"
                    />
                    <Tab
                      label="UTILISATEUR"
                      value="users"
                      icon={<GroupOutlined />}
                      iconPosition="start"
                    />
                  </TabList>
                </Box>
                <TabPanel value="informations">
                  <ClientInformations />
                </TabPanel>
                <TabPanel value="subscriptions">
                  <ClientSubscriptions />
                </TabPanel>
                <TabPanel value="users">
                  <ClientUsers />
                </TabPanel>
              </TabContext>
            </Box>
          </form>
        </FormProvider>
      </Box>
    </Box>
  );
}

export default ClientDetails;
