import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../services/axios";
import { INVOICE_API_URL } from "../invoices/invoiceSlice";
import { Box, Grid, IconButton, Typography } from "@mui/material";
import { ArrowBackIos } from "@mui/icons-material";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { InvoiceConstants as IC } from "../../lib/constants/InvoiceConstants";

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
    [IC.CONSUMPTION_TYPE]: yup
    .string()
    .required("Le type est requis"),
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
    [IC.INVOICE_FILEURI]: yup
    .string()
    .optional(),
    [IC.CONSUMPTION_HTAMOUNT]: yup
    .number()
    .required("Le montant HT est requis")
    .typeError("Le montant HT doit être un nombre"),
});

function InvoiceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const goBack = () => {
    navigate("/invoices");
  };

  const getInvoice = useCallback((id: number): void => {
    setLoading(true);
    axiosInstance
      .get(`${INVOICE_API_URL}/${id}`)
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (id) getInvoice(parseInt(id));
  }, [id]);

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        py: 2,
      }}
    >
      <Grid container sx={{ height: "100%" }} columnSpacing={2}>
        <Grid
          item
          flexGrow={1}
          sx={{
            backgroundColor: "#FFF",
            borderRadius: "0.75rem",
            p: "1rem 0.75rem",
            border: "1px solid #EAEEF4",
          }}
        >
          <Box>
            <Box mb={3}>
              <IconButton onClick={goBack}>
                <ArrowBackIos />
              </IconButton>
            </Box>
          </Box>
          <Typography
            sx={{
              fontSize: "1rem",
              fontStyle: "normal",
              fontWeight: "700",
              mb: 2,
            }}
          >
            Détails de la facture
          </Typography>
        </Grid>
        <Grid item sx={{ width: "30%" }}>
          <Grid
            container
            flexDirection={"column"}
            sx={{ height: "100%", justifyContent: "space-between" }}
          >
            <Grid item sx={{ backgroundColor: "blue", height: "28%" }}>
              Information Client
            </Grid>
            <Grid item sx={{ backgroundColor: "red", height: "68%" }}>
              Information Facture
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}

export default InvoiceDetail;
