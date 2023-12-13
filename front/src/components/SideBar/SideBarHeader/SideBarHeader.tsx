import React from "react";
import { Box } from "@mui/material";
import Logo from "../../../assets/images/logo.png";

function SideBarHeader() {
  return (
    <Box
      sx={{
        display: "flex",
        height: "64px",
        boxSizing: "content-box",
        alignItems: "center",
        justifyContent: "center",
        pt: 2,
        pb: 5,
        px: 3,
      }}
    >
      <img src={Logo} alt="logo" style={{ width: "100%" }} />
    </Box>
  );
}

export default SideBarHeader;
