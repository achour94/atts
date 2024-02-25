import React, { useState, FormEvent } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
} from "@mui/material";
import MuiButton from "../../components/Form/MuiButton";
import axiosInstance from "../../services/axios";
import { toast } from "react-toastify";
import { USER_API_URL } from "../../lib/constants/UserConstants";

const ChangePasswordForm: React.FC = () => {
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();

    if (newPassword !== confirmPassword) {
        toast.error("Les mots de passe ne correspondent pas.");
      return;
    }

    setLoading(true);
    setError(null);

    const apiUrl = USER_API_URL + "/password";
    const requestBody = { newPassword };
    
    axiosInstance.put(apiUrl, requestBody)
      .then(() => { 
        toast.success("Mot de passe changé avec succès !");
      })
      .catch((error) => {
        setError("Une erreur s'est produite lors du changement de mot de passe.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
      <Typography variant="h6" gutterBottom>
        Changer le mot de passe
      </Typography>
      {error && <Typography color="error">{error}</Typography>}
      <TextField
        label="Nouveau mot de passe"
        variant="outlined"
        type="password"
        fullWidth
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        sx={{ mb: 2 }}
      />
      <TextField
        label="Confirmer le nouveau mot de passe"
        variant="outlined"
        type="password"
        fullWidth
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        sx={{ mb: 2 }}
      />
      <MuiButton
        label="Changer le mot de passe"
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        disabled={loading}
      />
    </Box>
  );
};

export default ChangePasswordForm;
