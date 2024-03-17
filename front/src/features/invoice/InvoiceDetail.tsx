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
import {
  downloadFile,
  formatDataToInvoiceForm,
  formatInvoiceData,
} from "../../utils/utils";
import MuiButton from "../../components/Form/MuiButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import InvoiceDetailsFormContainer from "../../components/InvoiceComponents/InvoiceDetailsFormContainer";
import ClientInformationsCard from "../../components/InvoiceComponents/ClientInformationsCard";
import { IClient } from "../../lib/interfaces/IClient";
import InvoiceInformationsCard from "../../components/InvoiceComponents/InvoiceInformationsCard";
import ConfirmationPopup from "../../components/utils/ConfirmationPopup";
import PDFDialog from "../../components/utils/PDFDialog";
import useRole from "../../hooks/useRole";
import { ROLES } from "../../lib/constants/utilsConstants";
import SendInvoiceEmailModal from "../../components/InvoiceComponents/SendInvoiceEmailModal";

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
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [openPdfDialog, setOpenPdfDialog] = useState(false);
  const [pdfFileName, setPdfFileName] = useState("");
  const [pdfData, setPdfData] = useState<Uint8Array | null>(null);
  const [openSendDialog, setOpenSendDialog] = useState(false);

  const isAdminAllowed = useRole([ROLES.ADMIN]);

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
        console.log("invoice", response?.data);
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

  const generateInvoicePdf = useCallback(
    (id: number, callback: (response: any) => void): void => {
      setLoading(true);
      axiosInstance({
        url: `${INVOICE_API_URL}/pdf`,
        method: "PUT",
        data: { id },
        responseType: "blob",
      })
        .then((response) => {
          callback(response);
          console.log(response);
        })
        .catch((error) => {
          toast.error("Une erreur est survenue");
          console.log(error);
        })
        .finally(() => {
          setLoading(false);
        });
    },
    []
  );

  const deleteInvoice = useCallback((id: number): void => {
    setLoading(true);
    axiosInstance
      .delete(`${INVOICE_API_URL}/${id}`)
      .then((response) => {
        toast.success("La facture a été supprimée");
        console.log(response);
        goBack();
      })
      .catch((error) => {
        toast.error("Une erreur est survenue");
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const shareInvoice = () => {
    axiosInstance
      .put(`${INVOICE_API_URL}/share/${id}`)
      .then((response) => {
        toast.success("Factures partagées avec succès");
        if (id) getInvoice(parseInt(id));
      })
      .catch((error) => {
        console.error("Error sharing invoices:", error);
        toast.error("Erreur lors du partage des factures");
      });
  };

  const openSendDialogHandler = () => {
    setOpenSendDialog(true);
  };

  const updateInvoice = useCallback((data: IInvoiceForm): void => {
    setLoading(true);
    axiosInstance
      .put(`${INVOICE_API_URL}`, data)
      .then((response) => {
        toast.success("La facture a été mise à jour");
        if (id) getInvoice(parseInt(id));
        console.log(response);
      })
      .catch((error) => {
        toast.error("Une erreur est survenue");
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const visualiseInvoiceHandler = useCallback((): void => {
    const visualiseCallback = (response: any) => {
      setPdfData(response?.data);
      setOpenPdfDialog(true);
      // get the file name from the response headers
      const contentDisposition = response.headers["content-disposition"];
      const fileName = contentDisposition
        ? contentDisposition.split(";")[1].split("=")[1]
        : `invoice_${id}.pdf`;
      setPdfFileName(fileName);
    };
    if (id) generateInvoicePdf(parseInt(id), visualiseCallback);
  }, []);

  const downloadInvoiceHandler = useCallback((): void => {
    const downloadCallback = (response: any) => {
      // get the file name from the response headers
      const contentDisposition = response.headers["content-disposition"];
      const fileName = contentDisposition
        ? contentDisposition.split(";")[1].split("=")[1]
        : `invoice_${id}.pdf`;
      downloadFile(response?.data, fileName);
    };
    if (id) generateInvoicePdf(parseInt(id), downloadCallback);
  }, []);

  const formatInvoiceBeforeUpdate = useCallback(
    (data: any) => {
      //format invoice consumptions, remove property 'id' if exist
      const consumptions = data[IC.INVOICE_CONSUMPTIONS].map(
        (consumption: any) => {
          const { id: _, ...consumptionData } = consumption;
          return consumptionData;
        }
      );
      const invoiceToUpdate = {
        ...data,
        [IC.INVOICE_CONSUMPTIONS]: consumptions,
        [IC.INVOICE_CLIENT]: {
          ...invoice?.[IC.INVOICE_CLIENT],
          [CC.CLIENT_USERS]: [],
        },
      };
      return invoiceToUpdate;
    },
    [invoice]
  );

  const onSubmit: SubmitHandler<any> = (data) => {
    console.log("data", data);
    console.log(data);
    console.log(methods.formState.errors);
    //check if thers is no error
    const hasNoErrors = Object.keys(methods.formState.errors).length === 0;
    if (hasNoErrors) {
      const invoiceToUpdate = formatInvoiceBeforeUpdate(data);
      updateInvoice(invoiceToUpdate);
    }
  };

  console.log("isDirty", methods.formState.isDirty);

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
                  {isAdminAllowed && (
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
                          disabled={
                            loading ||
                            !isAdminAllowed ||
                            !methods.formState.isDirty ||
                            methods.formState.isSubmitting
                          }
                        />
                        <MuiButton
                          color="error"
                          startIcon={<DeleteIcon />}
                          label="Supprimer"
                          onClick={() => setOpenConfirmation(true)}
                        />
                      </Stack>
                    </Grid>
                  )}
                </Grid>
              </StyledBoxContainer>
            </Grid>
          </Grid>
          {pdfData && (
            <PDFDialog
              open={openPdfDialog}
              onClose={() => setOpenPdfDialog(false)}
              pdfFile={pdfData}
              pdfFileName={pdfFileName}
            />
          )}
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
              <Grid container flexDirection={"column"} sx={{ height: "100%" }}>
                <Grid item sx={{ minHeight: "29%", mb: 4 }}>
                  <StyledBoxContainer sx={{ height: "100%" }}>
                    <ClientInformationsCard
                      client={invoice?.[IC.INVOICE_CLIENT] as IClient}
                    />
                  </StyledBoxContainer>
                </Grid>
                <Grid item sx={{ minHeight: "300px" }}>
                  <StyledBoxContainer sx={{ minHeight: "100%" }}>
                    <InvoiceInformationsCard
                      invoice={invoice as IInvoice}
                      onVisualize={visualiseInvoiceHandler}
                      onDownload={downloadInvoiceHandler}
                      onShare={shareInvoice}
                      onSend={openSendDialogHandler}
                    />
                  </StyledBoxContainer>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </form>
      </FormProvider>

      <ConfirmationPopup
        open={openConfirmation}
        title="Confirmer la suppression"
        message="Êtes-vous sûr de vouloir supprimer cette facture ?"
        onConfirm={() => deleteInvoice(parseInt(id as string))}
        onCancel={() => setOpenConfirmation(false)}
      />

      {openSendDialog && (
        <SendInvoiceEmailModal
          open={openSendDialog}
          onClose={() => setOpenSendDialog(false)}
          invoiceIds={[parseInt(id as string)]}
        />
      )}
    </Box>
  );
}

export default InvoiceDetail;
