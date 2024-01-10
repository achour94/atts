import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  MenuItem,
  Typography,
} from "@mui/material";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { IConsumption } from "../../lib/interfaces/IInvoice";
import {
  ConsumptionType,
  InvoiceConstants as IC,
} from "../../lib/constants/InvoiceConstants";
import { consumptionSchema } from "../../features/invoice/InvoiceDetail";
import MuiNumberField from "../Form/MuiNumberField";
import MuiSelect from "../Form/MuiSelect";
import { getConsumptionTypeLabel } from "../../utils/utils";

interface IAddConsumptionDialogProps {
  open: boolean;
  handleClose: () => void;
  onSubmit: (data: IConsumption) => void;
}
const initialValues: IConsumption = {
  [IC.CONSUMPTION_COUNT]: 0,
  [IC.CONSUMPTION_DURATION]: 0,
  [IC.CONSUMPTION_ENDDATE]: 0,
  [IC.CONSUMPTION_HTAMOUNT]: 0,
  [IC.CONSUMPTION_STARTDATE]: 0,
  [IC.CONSUMPTION_TYPE]: "",
};
function AddConsumptionDialog({
  open,
  handleClose,
  onSubmit,
}: IAddConsumptionDialogProps) {
  const methods = useForm<IConsumption>({
    resolver: yupResolver(consumptionSchema),
    defaultValues: initialValues,
  });

  const addClickHandler = (data: IConsumption) => {
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
    <Dialog open={open} onClose={handleClose} maxWidth="lg">
      <DialogTitle> Ajouter une consommation </DialogTitle>
      <FormProvider {...methods}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={3}>
              <Typography
                sx={{
                  fontSize: "1rem",
                  fontWeight: 700,
                  fontStyle: "normal",
                  lineHeight: "1.875rem",
                  mb: "0.75rem",
                }}
              >
                Type
              </Typography>
              <MuiSelect
                name={IC.CONSUMPTION_TYPE}
                label="Type"
                placeholder="Type"
              >
                {Object.entries(ConsumptionType).map(([key, value]) => (
                  <MenuItem key={key} value={key}>
                    {getConsumptionTypeLabel(key as ConsumptionType)}
                  </MenuItem>
                ))}
              </MuiSelect>
            </Grid>
            <Grid item xs={3}>
              <MuiNumberField
                name={IC.CONSUMPTION_DURATION}
                label="Durée"
                placeholder="Durée"
              />
            </Grid>
            <Grid item xs={3}>
              <MuiNumberField
                name={IC.CONSUMPTION_COUNT}
                label="Nombre"
                placeholder="Nombre d'appels"
              />
            </Grid>
            <Grid item xs={3}>
              <MuiNumberField
                name={IC.CONSUMPTION_HTAMOUNT}
                label="Montant HT"
                placeholder="Montant HT"
                step="0.1"
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

export default AddConsumptionDialog;
