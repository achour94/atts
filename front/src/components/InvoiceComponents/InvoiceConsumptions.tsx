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
import { ConsumptionType, InvoiceConstants as IC } from "../../lib/constants/InvoiceConstants";
import { IClient, ISubscription } from "../../lib/interfaces/IClient";
import { ActionMenu } from "../utils/ActionMenu";
import { IConsumption, IInvoice } from "../../lib/interfaces/IInvoice";
import SecondaryTitle from "../utils/Typography/SecondaryTitle";
import AddConsumptionDialog from "./AddConsumptionDialog";
import { formatNumberToEuro, formatSeconds, getConsumptionTypeLabel } from "../../utils/utils";
import EditConsumptionDialog from "./EditConsumptionDialog";

const headCellStyle = {
  fontSize: "1rem",
  fontWeight: 700,
  fontStyle: "normal",
  lineHeight: "normal",
  color: "#696969",
};

function InvoiceConsumptions() {
  const {
    control,
    formState: { errors },
  } = useFormContext<IInvoice>();
  const { fields, append, remove, update } = useFieldArray({
    control,
    name: IC.INVOICE_CONSUMPTIONS,
  });
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [consumptionToEdit, setConsumptionToEdit] = useState<IConsumption>(
    {} as IConsumption
  );
  const [consumptionIndex, setConsumptionIndex] = useState<number | null>(
    null
  );

  // Handle opening the modal
  const handleOpenAddModal = () => {
    setOpenAddModal(true);
  };

  // Handle closing the modal
  const handleCloseAddModal = () => {
    setOpenAddModal(false);
  };

  // Handle adding a new consumption
    const handleAddConsumption = (consumption: IConsumption) => {
      console.log(consumption);
      append(consumption);
      handleCloseAddModal();
    };

    const handleUpdateConsumption = (
      consumption: IConsumption
    ) => {
      console.log(consumption);
      if (consumptionIndex !== null) {
        update(consumptionIndex, consumption);
        setOpenEditModal(false);
      }
    };

    const handleCloseEditModal = () => {
      setConsumptionIndex(null);
      setOpenEditModal(false);
      setConsumptionToEdit({} as IConsumption);
    }

  const editActionClickHandler = (index: number, consumption: IConsumption) => {
    console.log("Edit action clicked");
    console.log(consumption);
    // const formattedSubscription = {
    //   [CC.CLIENT_SUBSCRIPTION_ID]: subscription[CC.CLIENT_SUBSCRIPTION_ID],
    //   [CC.CLIENT_SUBSCRIPTION_NAME]: subscription[CC.CLIENT_SUBSCRIPTION_NAME],
    //   [CC.CLIENT_SUBSCRIPTION_DATA]: subscription[CC.CLIENT_SUBSCRIPTION_DATA],
    //   [CC.CLIENT_SUBSCRIPTION_PRICE]: subscription[CC.CLIENT_SUBSCRIPTION_PRICE],
    // };
    setConsumptionToEdit(consumption);
    setConsumptionIndex(index);
    setOpenEditModal(true);
  };

  const deleteActionClickHandler = (index: number) => {
    console.log("Delete action clicked");
    remove(index);
  };

  const calculateTotalHTAmount = () => {
    return fields.reduce((total, consumption) => {
      return total + (consumption?.[IC.CONSUMPTION_HTAMOUNT] || 0);
    }, 0);
  };

  console.log("fields", fields);

  return (
    <Box>
      <Grid container justifyContent={"space-between"} alignItems="center" sx={{mt: 4,}} >
        <Grid item>
          <SecondaryTitle title={"Consommations"} style={{ marginBottom: 0 }} />
        </Grid>
        <Grid item>
          <Button
            startIcon={<AddCircleOutlineIcon />}
            color="primary"
            onClick={handleOpenAddModal}
          >
            Ajouter
          </Button>
        </Grid>
      </Grid>
      <Paper elevation={0} sx={{ boxShadow: "none", backgroundColor: "#FFF" }}>
        <List sx={{ width: "100%" }}>
          <ListItem
            sx={{
              mb: "0.125rem",
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
                  flexGrow={1}
                  sx={{
                    display: "flex",
                    justifyContent: "start",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="body1" sx={headCellStyle}>
                    Type
                  </Typography>
                </Grid>
                <Grid
                  item
                  xs={2}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="body1" sx={headCellStyle}>
                    Appels
                  </Typography>
                </Grid>
                <Grid
                  item
                  xs={2}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="body1" sx={headCellStyle}>
                    Durée
                  </Typography>
                </Grid>
                <Grid
                  item
                  xs={2}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="body1" sx={headCellStyle}>
                    Montant HT
                  </Typography>
                </Grid>
                <Grid
                  item
                  xs={2}
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
          <Box sx={{
            maxHeight: "300px",
            overflow: "auto"
          }} >
          {fields.map((consumption, index) => (
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
                    flexGrow={1}
                    sx={{
                      display: "flex",
                      justifyContent: "start",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                      {getConsumptionTypeLabel(consumption?.[IC.CONSUMPTION_TYPE] as ConsumptionType)}
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    xs={2}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="body1">
                      {consumption?.[IC.CONSUMPTION_COUNT]}
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    xs={2}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="body1">
                      {formatSeconds(consumption?.[IC.CONSUMPTION_DURATION])}
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    xs={2}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="body1">
                      {formatNumberToEuro(consumption?.[IC.CONSUMPTION_HTAMOUNT])}
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    xs={2}
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
                            editActionClickHandler(index, consumption),
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

          </Box>
        </List>
      </Paper>
      <Box>
        <Grid container justifyContent={"flex-end"}>
          <Grid item>
            <Box sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              mt: 2,
              mr: 2
            }}>
              <Typography sx={{
                color: "#868DA6",
                fontSize: "0.625rem",
                fontStyle: "normal",
                fontWeight: "400"
              }}
              >TOTAL HT</Typography>
              <Typography sx={{
                color: "#EE7F01",
                fontSize: "1.5rem",
                fontStyle: "normal",
                fontWeight: "700"
              }}>
                {formatNumberToEuro(calculateTotalHTAmount())}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Modal for Adding consumption */}
      {openAddModal && (
        <AddConsumptionDialog
          open={openAddModal}
          handleClose={handleCloseAddModal}
          onSubmit={handleAddConsumption}
        />
      )}

      {openEditModal && (
        <EditConsumptionDialog
          open={openEditModal}
          consumption={consumptionToEdit}
          handleClose={() => handleCloseEditModal()}
          onSubmit={(data) => handleUpdateConsumption(data)}
        />
      )}
    </Box>
  );
}

export default InvoiceConsumptions;
