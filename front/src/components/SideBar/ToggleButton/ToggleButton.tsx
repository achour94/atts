import { Box, IconButton } from "@mui/material";
import React, { FC } from "react";
import ArrowBackIosOutlinedIcon from "@mui/icons-material/ArrowBackIosOutlined";
import ArrowForwardIosOutlinedIcon from "@mui/icons-material/ArrowForwardIosOutlined";

interface IToggleButtonProps {
  toggleCollapsed: () => void;
  collapsed: boolean;
}

const ToggleButton: FC<IToggleButtonProps> = ({
  toggleCollapsed,
  collapsed,
}) => {
  return (
    <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
        <Box sx={{ display: "flex", backgroundColor: '#F2F2F2', borderTopLeftRadius: '50%',
        borderBottomLeftRadius: '50%', }}>
      <IconButton onClick={toggleCollapsed}>
        {collapsed ? (
          <ArrowForwardIosOutlinedIcon />
        ) : (
          <ArrowBackIosOutlinedIcon />
        )}
      </IconButton>
        
        </Box>
    </Box>
  );
};

export default ToggleButton;
