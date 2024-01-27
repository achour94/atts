import React, { useState } from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import {
  Box,
  Grid,
} from "@mui/material";
import { ClientConstants as CC } from "../../lib/constants/ClientConstants";
import { IClient } from "../../lib/interfaces/IClient";
import { IUser } from "../../lib/interfaces/IUser";
import MuiTextField from "../Form/MuiTextField";
import { UserConstants as UC } from "../../lib/constants/UserConstants";

function ClientUsers() {
  const {
    control,
    formState: { errors },
    watch,
  } = useFormContext<IClient>();
  const { fields } = useFieldArray({
    control,
    name: CC.CLIENT_USERS,
  });

  console.log("fields", fields);

  console.log(watch());

  return (
    <Box
      sx={{
        p: 2,
        backgroundColor: "#FFFFFF",
        borderRadius: "8px",
        overflow: "hidden",
      }}
    >
      <Box px={"1.5rem"} py={"0.75rem"}>
        <Grid container rowSpacing={4}>
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <MuiTextField
                  name={`${CC.CLIENT_USERS}[0].${UC.USER_LASTNAME}`}
                  label="Nom"
                  placeholder="Nom"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <MuiTextField
                  name={`${CC.CLIENT_USERS}[0].${UC.USER_FIRSTNAME}`}
                  label="Prénom"
                  placeholder="Prénom"
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <MuiTextField
                  name={`${CC.CLIENT_USERS}[0].${UC.USER_EMAIL}`}
                  label="Email"
                  placeholder="Email"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <MuiTextField
                  name={`${CC.CLIENT_USERS}[0].${UC.USER_PHONE}`}
                  label="Numéro de téléphone"
                  placeholder="0033*********"
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default ClientUsers;
