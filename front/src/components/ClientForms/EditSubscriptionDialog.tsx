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

interface IEditSubscriptionDialogProps {
  open: boolean;
  subscription: ISubscription;
  handleClose: () => void;
  onSubmit: (data: ISubscription) => void;
}

function EditSubscriptionDialog({
  open,
  subscription,
  handleClose,
  onSubmit,
}: IEditSubscriptionDialogProps) {
  const methods = useForm<ISubscription>({
    resolver: yupResolver(subscriptionSchema),
    defaultValues: subscription,
  });

  const editClickHandler = (data: ISubscription) => {
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
      <DialogTitle> Modifier un abonnement </DialogTitle>
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
              disabled={
                methods.formState.isSubmitting || !methods.formState.isDirty
              }
              onClick={methods.handleSubmit((data) => editClickHandler(data))}
            >
              Modifier
            </Button>
          </DialogActions>
        </DialogContent>
      </FormProvider>
    </Dialog>
  );
}

export default EditSubscriptionDialog;
