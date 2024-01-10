import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../services/axios";
import { INVOICE_API_URL } from "../invoices/invoiceSlice";
import {
  Box,
  Grid,
  IconButton,
  Stack,
  Typography,
  styled,
} from "@mui/material";
import { ArrowBackIos } from "@mui/icons-material";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { InvoiceConstants as IC } from "../../lib/constants/InvoiceConstants";
import { ClientConstants as CC } from "../../lib/constants/ClientConstants";
import { clientSchema } from "../clients/ClientDetails";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import {
  IConsumption,
  IInvoice,
  IInvoiceForm,
} from "../../lib/interfaces/IInvoice";
import { toast } from "react-toastify";
import { formatDataToInvoiceForm, formatInvoiceData } from "../../utils/utils";
import SecondaryTitle from "../../components/utils/Typography/SecondaryTitle";
import InvoiceGlobalInfosCard from "../../components/InvoiceComponents/InvoiceGlobalInfosCard";
import MuiSwitch from "../../components/Form/MuiSwitch";
import MuiDate from "../../components/Form/MuiDate";
import MuiButton from "../../components/Form/MuiButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import InvoiceDetailsFormContainer from "../../components/InvoiceComponents/InvoiceDetailsFormContainer";
import ClientInformationsCard from "../../components/InvoiceComponents/ClientInformationsCard";
import { IClient } from "../../lib/interfaces/IClient";
import InvoiceInformationsCard from "../../components/InvoiceComponents/InvoiceInformationsCard";

//styled box Container
const StyledBoxContainer = styled(Box)(({ theme }) => ({
  backgroundColor: "#FFF",
  borderRadius: "0.75rem",
  padding: "1rem 0.75rem",
  border: "1px solid #EAEEF4",
}));

// Consumption Schema
export const consumptionSchema = yup.object({
  [IC.CONSUMPTION_COUNT]: yup
    .number()
    .required("La quantité est requise")
    .typeError("La quantité doit être un nombre"),
  [IC.CONSUMPTION_DURATION]: yup
    .number()
    .required("La durée est requise")
    .typeError("La durée doit être un nombre"),
  [IC.CONSUMPTION_ID]: yup
    .number()
    .optional()
    .typeError("L'ID doit être un nombre"),
  [IC.CONSUMPTION_ENDDATE]: yup
    .number()
    .required("La date de fin est requise")
    .typeError("La date de fin doit être un nombre"),
  [IC.CONSUMPTION_HTAMOUNT]: yup
    .number()
    .required("Le montant HT est requis")
    .typeError("Le montant HT doit être un nombre"),
  [IC.CONSUMPTION_STARTDATE]: yup
    .number()
    .required("La date de début est requise")
    .typeError("La date de début doit être un nombre"),
  [IC.CONSUMPTION_TYPE]: yup.string().required("Le type est requis"),
});

// Invoice Schema
const invoiceSchema = yup.object({
  [IC.INVOICE_CREATONDATE]: yup
    .number()
    .required("La date de création est requise")
    .typeError("La date de création doit être un nombre"),
  [IC.INVOICE_ENDPERIOD]: yup
    .number()
    .required("La période de fin est requise")
    .typeError("La période de fin doit être un nombre"),
  [IC.INVOICE_FILEURI]: yup.string().optional().nullable(),
  [IC.CONSUMPTION_HTAMOUNT]: yup
    .number()
    .required("Le montant HT est requis")
    .typeError("Le montant HT doit être un nombre"),
  [IC.INVOICE_NUMBER]: yup
    .number()
    .required("Le numéro de facture est requis")
    .typeError("Le numéro de facture doit être un nombre"),
  [IC.INVOICE_PROFORMA]: yup.boolean().typeError("Doit être un booléen"),
  [IC.INVOICE_STARTPERIOD]: yup
    .number()
    .required("La période de début est requise")
    .typeError("La période de début doit être un nombre"),
  [IC.INVOICE_STATUS]: yup.string().required("Le statut est requis"),
  [IC.INVOICE_TTCAMOUNT]: yup
    .number()
    .required("Le montant TTC est requis")
    .typeError("Le montant TTC doit être un nombre"),
  [IC.INVOICE_TVA]: yup
    .number()
    .required("La TVA est requise")
    .typeError("La TVA doit être un nombre"),
  [IC.INVOICE_CONSUMPTIONS]: yup.array().of(consumptionSchema).optional(),
});

function InvoiceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [invoice, setInvoice] = useState<IInvoice>();

  const goBack = () => {
    navigate("/invoices");
  };

  const invoiceInitialValues = {
    [IC.INVOICE_CREATONDATE]: 0,
    [IC.INVOICE_ENDPERIOD]: 0,
    [IC.INVOICE_FILEURI]: "",
    [IC.CONSUMPTION_HTAMOUNT]: 0,
    [IC.INVOICE_NUMBER]: 0,
    [IC.INVOICE_PROFORMA]: false,
    [IC.INVOICE_STARTPERIOD]: 0,
    [IC.INVOICE_STATUS]: "DRAFT",
    [IC.INVOICE_TTCAMOUNT]: 0,
    [IC.INVOICE_TVA]: 0,
    [IC.INVOICE_CONSUMPTIONS]: [] as IConsumption[],
  };

  const methods = useForm({
    resolver: yupResolver(invoiceSchema),
    defaultValues: invoiceInitialValues,
  });

  const getInvoice = useCallback((id: number): void => {
    setLoading(true);
    axiosInstance
      .get(`${INVOICE_API_URL}/${id}`)
      .then((response) => {
        console.log(response.data);
        const invoice: IInvoice = formatInvoiceData(response?.data);
        const { [IC.INVOICE_CLIENT]: _, ...invoiceFormData } = invoice;
        methods.reset(invoiceFormData as IInvoiceForm);
        setInvoice(invoice);
      })
      .catch((error) => {
        toast.error("Une erreur est survenue");
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (id) getInvoice(parseInt(id));
  }, [id]);

  const onSubmit: SubmitHandler<any> = (data) => {
    console.log("data", data);
    console.log(data);
    console.log(methods.formState.errors);
    //check if thers is no error
    const hasNoErrors = Object.keys(methods.formState.errors).length === 0;
  };
  console.log("errors", methods.formState.errors);
  console.log("invoice form values", methods.getValues());

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        py: 2,
      }}
    >
      <FormProvider {...methods}>
        <form
          style={{ height: "100%" }}
          onSubmit={methods.handleSubmit(onSubmit)}
        >
          <Grid container mb={3}>
            <Grid item sm={12}>
              <StyledBoxContainer>
                <Grid container justifyContent={"space-between"}>
                  <Grid item>
                    <IconButton onClick={goBack}>
                      <ArrowBackIos />
                    </IconButton>
                  </Grid>
                  <Grid item>
                    <Stack
                      direction="row"
                      spacing={2}
                      justifyContent={"flex-end"}
                    >
                      <MuiButton
                        type="submit"
                        color="primary"
                        startIcon={<EditIcon />}
                        label="Modifier"
                      />
                      <MuiButton
                        color="error"
                        startIcon={<DeleteIcon />}
                        label="Supprimer"
                      />
                    </Stack>
                  </Grid>
                </Grid>
              </StyledBoxContainer>
            </Grid>
          </Grid>
          <Grid container sx={{ minHeight: "90%" }}>
            <Grid
              item
              flexGrow={1}
              sx={{
                marginRight: "1rem",
              }}
            >
              <StyledBoxContainer sx={{ minHeight: "100%" }}>
                <InvoiceDetailsFormContainer invoice={invoice} />
              </StyledBoxContainer>
            </Grid>
            <Grid item sx={{ width: "30%" }}>
              <Grid
                container
                flexDirection={"column"}
                sx={{ height: "100%" }}
              >
                <Grid item sx={{ minHeight: "29%", mb: 4 }}>
                  <StyledBoxContainer sx={{ height: "100%" }}>
                    <ClientInformationsCard client={invoice?.[IC.INVOICE_CLIENT] as IClient} /> 
                  </StyledBoxContainer>
                </Grid>
                <Grid item sx={{minHeight: "300px" }}>
                  <StyledBoxContainer sx={{minHeight: "100%" }}>
                    <InvoiceInformationsCard invoice={invoice as IInvoice} />
                  </StyledBoxContainer>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </form>
      </FormProvider>
    </Box>
  );
}

export default InvoiceDetail;
