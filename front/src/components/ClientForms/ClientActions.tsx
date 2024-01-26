import React, { useState } from "react";
import { Stack } from "@mui/material";
import MuiButton from "../Form/MuiButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import ConfirmationPopup from "../utils/ConfirmationPopup";

interface Props {
  isAddMode?: boolean;
  onDelete: () => void;
}

function ClientActions({ isAddMode = false, onDelete }: Props) {
  const [openConfirmation, setOpenConfirmation] = useState(false);

  const handleDelete = () => {
    setOpenConfirmation(true);
  };

  const handleConfirmDelete = () => {
    onDelete();
    setOpenConfirmation(false);
  };

  const handleCloseConfirmation = () => {
    setOpenConfirmation(false);
  };

  return (
    <>
      <Stack direction="row" spacing={2} justifyContent={"flex-end"}>
        {!isAddMode && (
          <>
            <MuiButton
              type="submit"
              color="primary"
              startIcon={<EditIcon />}
              label="Modifier"
            />
            <MuiButton
              color="error"
              startIcon={<DeleteIcon />}
              label="Supprimer"
              onClick={handleDelete}
            />
          </>
        )}
        {isAddMode && (
          <MuiButton
            type="submit"
            color="primary"
            startIcon={<AddOutlinedIcon />}
            label="Ajouter"
          />
        )}
      </Stack>
      <ConfirmationPopup
        open={openConfirmation}
        title="Confirmer la suppression"
        message="Êtes-vous sûr de vouloir supprimer cet élément ?"
        onConfirm={handleConfirmDelete}
        onCancel={handleCloseConfirmation}
      />
    </>
  );
}

export default ClientActions;
