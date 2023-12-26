import { Box } from "@mui/material";
import React from "react";

interface IStatusProps {
  status: string;
  bgColor: string;
  color: string;
}

function InvoiceStatusContainer({ status, bgColor, color }: IStatusProps) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: "2rem",
        backgroundColor: bgColor,
        color: color,
        padding: "0.25rem 1.5rem",
        maxWidth: "6rem",
        fontSize: "0.75rem",
        fontStyle: "normal",
        fontWeight: 500,
      }}
    >
      <span>{status}</span>
    </Box>
  );
}

export default InvoiceStatusContainer;
