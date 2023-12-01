import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import { Logo } from './Logo';
import {CollapsedTab, Tab} from './Tabs';
import IconButton from '@mui/material/IconButton';

const SIDEBAR_FULL_WIDTH = 290;
const SIDEBAR_COLLAPSED_WIDTH = 80;
const TABS = {
  dasboard: {
    text: 'Dashboard',
    icon: 'home',
    link: 'dashboard'
  },
  clients: {
    text: 'Clients',
    icon: 'group',
    link: 'clients'
  },
  invoices: {
    text: 'Invoices',
    icon: 'description',
    link: 'invoices'
  },
  history: {
    text: 'History',
    icon: 'history',
    link: 'history'
  },
  profile: {
    text: 'Profile',
    icon: 'account',
    link: 'profile'
  }
};

export default function SidebarMenu() {
  const [collapsed, setCollapsed] = React.useState(false);

  return (
    <Box sx={{ display: 'flex' }}>
      <Drawer
        sx={{
          flexShrink: 0,
          width: collapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_FULL_WIDTH,
          height: '100%',
          '& .MuiDrawer-paper': {
            width: collapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_FULL_WIDTH,
            height: '100%',
            boxSizing: 'border-box',
            borderRadius: '15px',
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Stack spacing={3} sx={{
          position: 'relative',
          top: '60px',
        }}>
          <IconButton sx={{position: 'absolute', width: '30px', backgroundColor: 'gray', right: '0px'}} onClick={() => setCollapsed(!collapsed)}>
            {!collapsed ? <ArrowBackIosNewIcon> </ArrowBackIosNewIcon> : <ArrowForwardIosIcon></ArrowForwardIosIcon>}
          </IconButton>
          <Logo src='logoatts.png'></Logo>
          <Divider />
          <List>
            {Object.values(TABS).map((tabInfo, index) => (
               !collapsed ? <Tab key={index} {...tabInfo}></Tab> : <CollapsedTab key={index} {...tabInfo}></CollapsedTab>
            ))}
          </List>
        </Stack>
      </Drawer>
    </Box>
  );
}