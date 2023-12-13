import { Box, CssBaseline } from '@mui/material';
import React from 'react'
import SidebarMenu from './oldSidebar/Sidebar';
import { Outlet } from 'react-router-dom';
import SideBar from './SideBar/SideBar';

const ProtectedLayout = () => (
    <Box sx={{ display: "flex", height: "100vh", width: "100vw" }}>
      <CssBaseline />
      <Box display={"flex"} width="100%" height="100%">
        <SideBar />
        <Box flexGrow={1} sx={{ display: "flex", backgroundColor: "#FAFBFF", padding: 2 }}>
          <Outlet /> {/* This is where nested routes will be rendered */}
        </Box>
      </Box>
    </Box>
  );

export default ProtectedLayout