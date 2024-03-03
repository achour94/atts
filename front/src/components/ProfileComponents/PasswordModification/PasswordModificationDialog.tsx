import React from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import axiosInstance from "../../../services/axios";
import { USER_API_URL } from "../../../lib/constants/UserConstants";
import { toast } from "react-toastify";

interface IFormInput {
  newPassword: string;
  confirmPassword: string;
}

// Validation schema
const schema = yup
  .object({
    newPassword: yup
      .string()
      .required("Le nouveau mot de passe est requis")
      .min(8, "Le mot de passe doit contenir au moins 8 caractères"),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("newPassword")], "Les mots de passe ne correspondent pas")
      .required("La confirmation du mot de passe est requise"),
  })
  .required();

const PasswordModificationDialog: React.FC<{
  open: boolean;
  onClose: () => void;
}> = ({ open, onClose }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IFormInput>({
    resolver: yupResolver(schema),
  });

  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    axiosInstance
      .put(`${USER_API_URL}/password`, { newPassword: data.newPassword })
      .then(() => {
        toast.success("Mot de passe changé avec succès !");
        reset();
        onClose();
      })
      .catch((error) => {
        console.error(error);
        toast.error("Une erreur s'est produite lors du changement de mot de passe.");
      });
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Modification du mot de passe</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Controller
            name="newPassword"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                margin="dense"
                label="Nouveau mot de passe"
                type="password"
                fullWidth
                variant="outlined"
                error={!!errors.newPassword}
                helperText={errors.newPassword?.message}
              />
            )}
          />
          <Controller
            name="confirmPassword"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                margin="dense"
                label="Confirmer le nouveau mot de passe"
                type="password"
                fullWidth
                variant="outlined"
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
              />
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Annuler</Button>
          <Button type="submit">Modifier</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default PasswordModificationDialog;
