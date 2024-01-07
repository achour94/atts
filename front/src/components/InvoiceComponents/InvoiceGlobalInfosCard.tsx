import { Box, Grid, Typography } from "@mui/material";
import React from "react";
import { formatTimestampToFrenchDate } from "../../utils/utils";
import styled from "@emotion/styled";

interface InvoiceGlobalInfosCardProps {
  invoiceNumber: number | string;
  clientName: string;
  invoiceDate: number;
}

//create styled item title
const StyledItemTitle = styled(Typography)(({ theme }) => ({
  fontSize: "0.7rem",
  fontStyle: "normal",
  fontWeight: "400",
  marginBottom: "0.125rem",
  color: "#868DA6",
}));

//create styled item value
const StyledItemValue = styled(Typography)(({ theme }) => ({
  fontSize: "0.625rem",
  fontStyle: "normal",
  fontWeight: "500",
  color: "#19213D",
}));

function InvoiceGlobalInfosCard({
  invoiceNumber,
  clientName,
  invoiceDate,
}: InvoiceGlobalInfosCardProps) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "flex-start",
        width: "100%",
        padding: '1rem 2rem 1rem 1rem',
        borderRadius: '0.625rem',
        border: '0.6px solid var(--Neutral-Colors-300, #EBEFF6)',
        background:'var(--Neutral-Colors-White, #FFF)',
        boxShadow: '0px 1px 3px 0px rgba(25, 33, 61, 0.05), 0px 2px 8px 0px rgba(25, 33, 61, 0.04)',
      }}
    >
      <Grid container justifyContent={"space-between"}>
        <Grid item>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            <StyledItemTitle>NUMÉRO</StyledItemTitle>
            <StyledItemValue>N°{invoiceNumber}</StyledItemValue>
          </Box>
        </Grid>
        <Grid item>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            <StyledItemTitle>CLIENT</StyledItemTitle>
            <StyledItemValue>{clientName}</StyledItemValue>
          </Box>
        </Grid>
        <Grid item>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            <StyledItemTitle>DATE D’ÉCHEANCE</StyledItemTitle>
            <StyledItemValue>
              {formatTimestampToFrenchDate(invoiceDate, "long")}
            </StyledItemValue>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default InvoiceGlobalInfosCard;
