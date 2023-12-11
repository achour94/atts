import React, { useState } from "react";
import { Box, Grid, Tab } from "@mui/material";
import { ArrowBackIos } from "@mui/icons-material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import BarChartIcon from "@mui/icons-material/BarChart";
import ClientInformations from "../ClientForms/ClientInformations";
import { IClient, ISubscrpition } from "../../lib/interfaces/IClient";
import { ClientConstants as CC } from "../../lib/constants/ClientConstants";
import { SubmitHandler, FormProvider, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import ClientActions from "../ClientForms/ClientActions";
import ClientSubscriptions from "../ClientForms/ClientSubscriptions";

// Subscription Schema
const subscriptionSchema = yup.object({
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

// Client Schema
const clientSchema = yup.object({
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
  [CC.CLIENT_POSTALCODE]: yup.string().optional(),
  [CC.CLIENT_ACTIVEDIVERSE]: yup.boolean().typeError("Doit être un booléen"),
  [CC.CLIENT_NAME]: yup.string().required("Le nom est requis"),
  [CC.CLIENT_ADDRESS]: yup.string().required("L'adresse est requise"),
  [CC.CLIENT_EMAIL]: yup.string().email("Doit être un email valide").optional(),
  [CC.CLIENT_SUBSCRIPTIONLIST]: yup.array().of(subscriptionSchema).optional(),
});

function ClientDetails() {
  const [activeTab, setActiveTab] = useState("informations");

  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: string) => {
    setActiveTab(newValue);
  };

  // Define initial form values
  const initialValues = {
    // Example initial values. Adjust based on your actual data structure
    [CC.CLIENT_ID]: 123,
    [CC.CLIENT_CLIENTREFERENCE]: "Ref-001",
    [CC.CLIENT_DEFAULTSUBSCRIPTION]: 1,
    [CC.CLIENT_DIVERSESUBSCRIPTION]: 2,
    [CC.CLIENT_POSTALCODE]: "75000",
    [CC.CLIENT_ACTIVEDIVERSE]: true,
    [CC.CLIENT_NAME]: "John Doe",
    [CC.CLIENT_ADDRESS]: "123 Main St",
    [CC.CLIENT_EMAIL]: "john.doe@example.com",
    [CC.CLIENT_SUBSCRIPTIONLIST]: [
      // Example subscription list
      {
        [CC.CLIENT_SUBSCRIPTION_ID]: 10,
        [CC.CLIENT_SUBSCRIPTION_NAME]: "Subscription 1",
        [CC.CLIENT_SUBSCRIPTION_DATA]: "Data 1",
        [CC.CLIENT_SUBSCRIPTION_PRICE]: 100,
      },
      {
        [CC.CLIENT_SUBSCRIPTION_ID]: 2,
        [CC.CLIENT_SUBSCRIPTION_NAME]: "Subscription 1",
        [CC.CLIENT_SUBSCRIPTION_DATA]: "Data 1",
        [CC.CLIENT_SUBSCRIPTION_PRICE]: 100,
      },
      {
        [CC.CLIENT_SUBSCRIPTION_ID]: 3,
        [CC.CLIENT_SUBSCRIPTION_NAME]: "Subscription 1",
        [CC.CLIENT_SUBSCRIPTION_DATA]: "Data 1",
        [CC.CLIENT_SUBSCRIPTION_PRICE]: 100,
      },
      // More subscriptions as needed
    ],
  };

  const methods = useForm({
    resolver: yupResolver(clientSchema),
    defaultValues: initialValues,
  });

  const onSubmit: SubmitHandler<any> = (data) => {
    console.log(data);
    // Handle form submission here
  };

  return (
    <Box
      sx={{
        backgroundColor: "#FFFFFF",
        borderRadius: "0.75rem",
        border: "1px solid #EAEEF4",
        width: "100%",
        p: 2,
      }}
    >
      <Box>
        {" "}
        <ArrowBackIos />{" "}
      </Box>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <Box>
            <ClientActions />
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
                </TabList>
              </Box>
              <TabPanel value="informations">
                <ClientInformations />
              </TabPanel>
              <TabPanel value="subscriptions">
                <ClientSubscriptions />
              </TabPanel>
            </TabContext>
          </Box>
        </form>
      </FormProvider>
    </Box>
  );
}

export default ClientDetails;
