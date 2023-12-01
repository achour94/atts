import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';

import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import { Logo } from './Logo';
import { CollapsedTab, Tab } from './Tabs/Tabs';
import CollapseButton from './CollapseButton/CollapseButton';

const SIDEBAR_FULL_WIDTH = 290;
const SIDEBAR_COLLAPSED_WIDTH = 90;
const TABS = {
  dasboard: {
    text: 'sidebar_tab_dashboard',
    icon: 'home',
    link: 'dashboard'
  },
  clients: {
    text: 'sidebar_tab_clients',
    icon: 'group',
    link: 'clients'
  },
  invoices: {
    text: 'sidebar_tab_invoices',
    icon: 'description',
    link: 'invoices'
  },
  history: {
    text: 'sidebar_tab_history',
    icon: 'history',
    link: 'history'
  },
  profile: {
    text: 'sidebar_tab_profile',
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
        <CollapseButton collapsed={collapsed} setCollapsed={setCollapsed}></CollapseButton>
        <Stack spacing={3} sx={{
          position: 'relative',
          top: '60px',
        }}>
          <Logo src='logoatts.png' collapsed={collapsed}></Logo>
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
