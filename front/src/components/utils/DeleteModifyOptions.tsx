import React from 'react';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

interface DeleteModifyOptionsProps {
  onDelete: () => void;
  onModify: () => void;
}

const DeleteModifyOptions: React.FC<DeleteModifyOptionsProps> = ({ onDelete, onModify }) => {
  return (
    <div>
      <IconButton size="small" onClick={onModify} aria-label="modify">
        <EditIcon fontSize="small" />
      </IconButton>
      <IconButton size="small" onClick={onDelete} aria-label="delete">
        <DeleteIcon fontSize="small" />
      </IconButton>
    </div>
  );
};

export default DeleteModifyOptions;
