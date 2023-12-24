import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
} from "@mui/material";
import React from "react";
import MuiTextField from "../Form/MuiTextField";
import { ClientConstants as CC } from "../../lib/constants/ClientConstants";
import { FormProvider, useForm } from "react-hook-form";
import { ISubscription } from "../../lib/interfaces/IClient";
import { subscriptionSchema } from "../../features/clients/ClientDetails";
import { yupResolver } from "@hookform/resolvers/yup";

interface IAddSubscriptionDialogProps {
  open: boolean;
  handleClose: () => void;
  onSubmit: (data: ISubscription) => void;
}
const initialValues: ISubscription = {
  [CC.CLIENT_SUBSCRIPTION_NAME]: "",
  [CC.CLIENT_SUBSCRIPTION_DATA]: "",
  [CC.CLIENT_SUBSCRIPTION_PRICE]: 0,
};
function AddSubscriptionDialog({
  open,
  handleClose,
  onSubmit,
}: IAddSubscriptionDialogProps) {
  const methods = useForm<ISubscription>({
    resolver: yupResolver(subscriptionSchema),
    defaultValues: initialValues,
  });

  const addClickHandler = (data: ISubscription) => {
    console.log(data);
    console.log(methods.formState.errors);
    //check if thers is no error
    const hasNoErrors = Object.keys(methods.formState.errors).length === 0;
    if (hasNoErrors) {
      console.log("no error");
      onSubmit(data);
    }
  };
  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md">
      <DialogTitle> Ajouter un abonnement </DialogTitle>
      <FormProvider {...methods}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <MuiTextField
                name={CC.CLIENT_SUBSCRIPTION_NAME}
                label="Nom"
                placeholder="Nom"
              />
            </Grid>
            <Grid item xs={4}>
              <MuiTextField
                name={CC.CLIENT_SUBSCRIPTION_DATA}
                label="Données"
                placeholder="Données"
              />
            </Grid>
            <Grid item xs={4}>
              <MuiTextField
                name={CC.CLIENT_SUBSCRIPTION_PRICE}
                label="Prix"
                placeholder="Prix"
              />
            </Grid>
          </Grid>
          <DialogActions>
            <Button onClick={handleClose}>Annuler</Button>
            <Button
              color="primary"
              onClick={methods.handleSubmit((data) => addClickHandler(data))}
            >
              Ajouter
            </Button>
          </DialogActions>
        </DialogContent>
      </FormProvider>
    </Dialog>
  );
}

export default AddSubscriptionDialog;
