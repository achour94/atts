import React, { useState } from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import {
  Paper,
  IconButton,
  Button,
  Box,
  List,
  ListItem,
  Typography,
  Grid,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { ClientConstants as CC } from "../../lib/constants/ClientConstants";
import { IClient, ISubscription } from "../../lib/interfaces/IClient";
import AddSubscriptionDialog from "./AddSubscriptionDialog";
import { ActionMenu } from "../utils/ActionMenu";
import EditSubscriptionDialog from "./EditSubscriptionDialog";

const headCellStyle = {
  fontSize: "1rem",
  fontWeight: 700,
  fontStyle: "normal",
  lineHeight: "normal",
  color: "#696969",
};

function ClientSubscriptions() {
  const {
    control,
    formState: { errors },
  } = useFormContext<IClient>();
  const { fields, append, remove, update } = useFieldArray({
    control,
    name: CC.CLIENT_SUBSCRIPTIONS,
  });
  const [openModal, setOpenModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [subscriptionToEdit, setSubscriptionToEdit] = useState<ISubscription>(
    {} as ISubscription
  );
  const [subscriptionIndex, setSubscriptionIndex] = useState<number | null>(null);

  // Handle opening the modal
  const handleOpenModal = () => {
    setOpenModal(true);
  };

  // Handle closing the modal
  const handleCloseModal = () => {
    setOpenModal(false);
  };

  // Handle adding a new subscription
  const handleAddSubscription = (subscription: ISubscription) => {
    console.log(subscription);
    append(subscription);
    handleCloseModal();
  };

  const handleUpdateSubscription = (
    subscription: ISubscription
  ) => {
    console.log(subscription);
    if (subscriptionIndex !== null) {
      update(subscriptionIndex, subscription);
      setOpenEditModal(false);
    }
  };

  const handleCloseEditModal = () => {
    setSubscriptionIndex(null);
    setOpenEditModal(false);
    setSubscriptionToEdit({} as ISubscription);
  }

  const editActionClickHandler = (
    index: number,
    subscription: ISubscription
  ) => {
    console.log("Edit action clicked");
    console.log(subscription);
    const formattedSubscription = {
      [CC.CLIENT_SUBSCRIPTION_ID]: subscription[CC.CLIENT_SUBSCRIPTION_ID],
      [CC.CLIENT_SUBSCRIPTION_NAME]: subscription[CC.CLIENT_SUBSCRIPTION_NAME],
      [CC.CLIENT_SUBSCRIPTION_DATA]: subscription[CC.CLIENT_SUBSCRIPTION_DATA],
      [CC.CLIENT_SUBSCRIPTION_PRICE]: subscription[CC.CLIENT_SUBSCRIPTION_PRICE],
    };
    setSubscriptionToEdit(formattedSubscription);
    // setSubscriptionToEdit(fields[index])
    setSubscriptionIndex(index);
    setOpenEditModal(true);
  };

  const deleteActionClickHandler = (index: number) => {
    console.log("Delete action clicked");
    remove(index);
  };

  console.log("fields", fields);

  return (
    <Box
      sx={{
        p: 2,
        backgroundColor: "#FFFFFF",
        borderRadius: "8px",
        overflow: "hidden",
      }}
    >
      <Paper elevation={0} sx={{ boxShadow: "none", backgroundColor: "#FFF" }}>
        <List sx={{ width: "100%" }}>
          <ListItem
            sx={{
              mb: "1rem",
            }}
          >
            <Box
              sx={{
                display: "flex",
                width: "100%",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Grid container>
                <Grid
                  item
                  xs={3}
                  sx={{
                    display: "flex",
                    justifyContent: "start",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="body1" sx={headCellStyle}>
                    Nom
                  </Typography>
                </Grid>
                <Grid
                  item
                  xs={3}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="body1" sx={headCellStyle}>
                    Données
                  </Typography>
                </Grid>
                <Grid
                  item
                  xs={3}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="body1" sx={headCellStyle}>
                    Prix
                  </Typography>
                </Grid>
                <Grid
                  item
                  xs={3}
                  sx={{
                    display: "flex",
                    justifyContent: "end",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="body1" sx={headCellStyle}>
                    Options
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </ListItem>
          {fields.map((subscription, index) => (
            <ListItem
              key={index}
              sx={{
                mb: 2,
                border: "1px solid #EAEEF4",
                borderRadius: "8px",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
                "&:last-child": {
                  mb: 0,
                },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  width: "100%",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Grid container>
                  <Grid
                    item
                    xs={3}
                    sx={{
                      display: "flex",
                      justifyContent: "start",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                      {subscription[CC.CLIENT_SUBSCRIPTION_NAME]}
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    xs={3}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="body1">
                      {subscription[CC.CLIENT_SUBSCRIPTION_DATA]}
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    xs={3}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="body1">
                      {subscription[CC.CLIENT_SUBSCRIPTION_PRICE]}
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    xs={3}
                    sx={{
                      display: "flex",
                      justifyContent: "end",
                      alignItems: "center",
                    }}
                  >
                    <ActionMenu
                      items={[
                        {
                          label: "Modifier",
                          action: () =>
                            editActionClickHandler(index, subscription),
                        },
                        {
                          label: "Supprimer",
                          action: () => deleteActionClickHandler(index),
                        },
                      ]}
                    />
                  </Grid>
                </Grid>
              </Box>
            </ListItem>
          ))}
        </List>
      </Paper>
      <Button
        startIcon={<AddCircleOutlineIcon />}
        sx={{ mt: 2, float: "right" }}
        color="primary"
        onClick={handleOpenModal}
      >
        Ajouter
      </Button>

      {/* Modal for Adding Subscription */}
      {openModal && (
        <AddSubscriptionDialog
          open={openModal}
          handleClose={handleCloseModal}
          onSubmit={handleAddSubscription}
        />
      )}

      {openEditModal && (
        <EditSubscriptionDialog
          open={openEditModal}
          subscription={subscriptionToEdit}
          handleClose={() => handleCloseEditModal()}
          onSubmit={(data) => handleUpdateSubscription(data)}
        />
      )}
    </Box>
  );
}

export default ClientSubscriptions;
