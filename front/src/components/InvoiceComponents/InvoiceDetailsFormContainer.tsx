import { Box, Grid } from "@mui/material";
import React from "react";
import SecondaryTitle from "../utils/Typography/SecondaryTitle";
import InvoiceGlobalInfosCard from "./InvoiceGlobalInfosCard";
import MuiSwitch from "../Form/MuiSwitch";
import MuiDate from "../Form/MuiDate";
import { IInvoice } from "../../lib/interfaces/IInvoice";
import { InvoiceConstants as IC, InvoiceStatus } from "../../lib/constants/InvoiceConstants";
import { ClientConstants as CC } from "../../lib/constants/ClientConstants";
import InvoiceConsumptions from "./InvoiceConsumptions";
import { ROLES } from "../../lib/constants/utilsConstants";
import useRole from "../../hooks/useRole";

interface InvoiceDetailsFormContainerProps {
    invoice: IInvoice | undefined;
}

function InvoiceDetailsFormContainer({ invoice }: InvoiceDetailsFormContainerProps) {
  const isAdminAllowed = useRole([ROLES.ADMIN]);

  return (
    <Box>
      <Box mb={3}>
        <SecondaryTitle title={"Détails de la facture"} />
        <InvoiceGlobalInfosCard
          invoiceNumber={invoice?.[IC.INVOICE_NUMBER] || 0}
          clientName={invoice?.[IC.INVOICE_CLIENT]?.[CC.CLIENT_NAME] || ""}
          invoiceStatus={invoice?.[IC.INVOICE_STATUS] || InvoiceStatus.DRAFT}
        />
      </Box>
      <Box mb={2}>
        <Grid container justifyContent={"space-between"} alignItems="center">
          <Grid item>
            <SecondaryTitle
              title={"Facture proforma"}
              style={{ marginBottom: 0 }}
            />
          </Grid>
          <Grid item>
            <MuiSwitch name={IC.INVOICE_PROFORMA} disabled={!isAdminAllowed} />
          </Grid>
        </Grid>
      </Box>
      <Box mb={2}>
        <MuiDate name={IC.INVOICE_CREATONDATE} label={"Date de création"} />
      </Box>
      <Box mb={2}>
        <InvoiceConsumptions />
      </Box>
    </Box>
  );
}

export default InvoiceDetailsFormContainer;
