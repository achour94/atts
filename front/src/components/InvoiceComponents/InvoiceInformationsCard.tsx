import React from "react";
import { IClient } from "../../lib/interfaces/IClient";
import { Avatar, Box, Button, Grid, Typography } from "@mui/material";
import SecondaryTitle from "../utils/Typography/SecondaryTitle";
import { ClientConstants as CC } from "../../lib/constants/ClientConstants";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import { IInvoice } from "../../lib/interfaces/IInvoice";
import MuiDate from "../Form/MuiDate";
import { InvoiceConstants as IC } from "../../lib/constants/InvoiceConstants";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import useRole from "../../hooks/useRole";
import { ROLES } from "../../lib/constants/utilsConstants";

interface IInvoiceInfosProps {
  invoice: IInvoice;
  onVisualize: () => void;
  onDownload: () => void;
}

function InvoiceInformationsCard({
  invoice,
  onVisualize,
  onDownload,
}: IInvoiceInfosProps) {
  const isAdminAllowed = useRole([ROLES.ADMIN]);
  return (
    <Box p={1}>
      <SecondaryTitle
        title="Informations facture"
        style={{ marginBottom: "2rem" }}
      />
      <Box mb={5}>
        <MuiDate
          name={IC.INVOICE_STARTPERIOD}
          label={"Date de début"}
          disabled={isAdminAllowed}
        />
      </Box>
      <Box mb={5}>
        <MuiDate
          name={IC.INVOICE_ENDPERIOD}
          label={"Date de d'échéance"}
          disabled={isAdminAllowed}
        />
      </Box>
      <Box mb={2}>
        <Grid
          container
          justifyContent={"space-between"}
          alignItems={"center"}
          spacing={1}
        >
          <Grid item xs={6}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<VisibilityOutlinedIcon />}
              color={"primary"}
              sx={{
                borderRadius: "2rem",
                px: "1.5rem",
                py: "0.5rem",
              }}
              onClick={onVisualize}
            >
              <Typography
                sx={{
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  fontStyle: "normal",
                }}
              >
                Visualiser
              </Typography>
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<DownloadOutlinedIcon />}
              color={"primary"}
              sx={{
                borderRadius: "2rem",
                px: "1.5rem",
                py: "0.5rem",
              }}
              onClick={onDownload}
            >
              <Typography
                sx={{
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  fontStyle: "normal",
                }}
              >
                Télécharger
              </Typography>
            </Button>
          </Grid>
        </Grid>
      </Box>
      {isAdminAllowed && (
        <Box mb={4}>
          <Button
            fullWidth
            variant="contained"
            startIcon={<SendOutlinedIcon />}
            color={"primary"}
            sx={{
              borderRadius: "2rem",
              px: "1.5rem",
              py: "0.5rem",
            }}
            // onClick={() => goToClientDetails(client?.[CC.CLIENT_ID] as number)}
          >
            <Typography
              sx={{ fontSize: "0.75rem", fontWeight: 700, fontStyle: "normal" }}
            >
              Envoyer par mail
            </Typography>
          </Button>
        </Box>
      )}
    </Box>
  );
}

export default InvoiceInformationsCard;
