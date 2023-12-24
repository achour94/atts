import React from 'react';
import { IconButton, Menu, MenuItem } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';

interface ActionItem {
  label: string;
  action: () => void;
}

interface ActionMenuProps {
  items: ActionItem[];
}

export const ActionMenu: React.FC<ActionMenuProps> = ({ items }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton
        edge="end"
        aria-label="actions"
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={open}
        onClose={handleClose}
        PaperProps={{
            style: {
                backgroundColor: "#FFF"
            }
        }}
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right'
        }}
        transformOrigin={{
            vertical: 'top',
            horizontal: 'right'
        }}
      >
        {items.map((item, index) => (
          <MenuItem key={index} onClick={() => { handleClose(); item.action(); }}>
            {item.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};
