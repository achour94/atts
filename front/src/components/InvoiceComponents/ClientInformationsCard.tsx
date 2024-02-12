import React from "react";
import { IClient } from "../../lib/interfaces/IClient";
import { Avatar, Box, Button, Grid, Typography } from "@mui/material";
import SecondaryTitle from "../utils/Typography/SecondaryTitle";
import { ClientConstants as CC } from "../../lib/constants/ClientConstants";
import { UserConstants as UC } from "../../lib/constants/UserConstants";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import { IUser } from "../../lib/interfaces/IUser";
import useRole from "../../hooks/useRole";
import { ROLES } from "../../lib/constants/utilsConstants";

interface IClientInfosProps {
  client: IClient;
}

function ClientInformationsCard({ client }: IClientInfosProps) {
  const navigate = useNavigate();

  const isAdminAllowed = useRole([ROLES.ADMIN]);

  const getFirstUserInfos = (users: IUser[]) => {
    if (users && users?.length > 0) {
      const user = users[0];
      return `${user?.lastName} ${user?.firstName}`;
    }
    return "Sans utilisateur";
  };

  const getClientEmail = (users: IUser[]) => {
    if (users && users?.length > 0) {
      const user = users[0];
      return user?.[UC.USER_EMAIL];
    }
    return "Email non renseigné";
  };

  const getClientPhone = (users: IUser[]) => {
    if (users && users?.length > 0) {
      const user = users[0];
      return user?.[UC.USER_PHONE];
    }
    return "Tél non renseigné";
  };

  const goToClientDetails = (clientId: number) => {
    navigate(`/client/${clientId}`);
  };

  return (
    <Box p={1}>
      <SecondaryTitle
        title="Informations client"
        style={{ marginBottom: "2rem" }}
      />
      <Grid container mb={3}>
        <Grid item mr={2}>
          <Avatar />
        </Grid>
        <Grid item flex={1}>
          <Typography
            sx={{
              fontSize: "1.125rem",
              fontStyle: "normal",
              fontWeight: "700",
              color: "#092C4C",
              lineHeight: "1.7rem",
            }}
          >
            {client?.[CC.CLIENT_NAME]}
          </Typography>
          <Typography
            sx={{
              fontSize: "1rem",
              fontStyle: "normal",
              fontWeight: "500",
              color: "#092C4C",
              lineHeight: "1.7rem",
            }}
          >
            {getFirstUserInfos(client?.[CC.CLIENT_USERS] as IUser[])}
          </Typography>
          <Typography
            sx={{
              fontSize: "1rem",
              fontStyle: "normal",
              fontWeight: "400",
              color: "#7E92A2",
              lineHeight: "1.7rem",
            }}
          >
            {getClientEmail(client?.[CC.CLIENT_USERS] as IUser[])}
          </Typography>
          <Typography
            sx={{
              fontSize: "1rem",
              fontStyle: "normal",
              fontWeight: "400",
              color: "#7E92A2",
              lineHeight: "1.7rem",
            }}
          >
            {getClientPhone(client?.[CC.CLIENT_USERS] as IUser[])}
          </Typography>
        </Grid>
      </Grid>
      {isAdminAllowed && (
        <Box mb={4}>
          <Button
            fullWidth
            variant="contained"
            startIcon={<ArrowBackIcon />}
            color={"primary"}
            sx={{
              borderRadius: "2rem",
              px: "1.5rem",
              py: "0.5rem",
            }}
            onClick={() => goToClientDetails(client?.[CC.CLIENT_ID] as number)}
          >
            <Typography
              sx={{ fontSize: "0.75rem", fontWeight: 700, fontStyle: "normal" }}
            >
              Aller à la fiche client
            </Typography>
          </Button>
        </Box>
      )}
    </Box>
  );
}

export default ClientInformationsCard;
