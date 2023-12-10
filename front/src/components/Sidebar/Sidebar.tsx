import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import { Logo } from './Logo';
import { CollapsedTab, Tab } from './Tabs/Tabs';
import CollapseButton from './CollapseButton/CollapseButton';
import Button from '@mui/material/Button';
import UserService from '../../services/UserService';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined';
import { useTranslation } from 'react-i18next';
import { ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';

const SIDEBAR_FULL_WIDTH = 290;
const SIDEBAR_COLLAPSED_WIDTH = 90;
const MAIN_TABS = {
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
};
const PROFILE_TABS = {
  profile: {
    text: 'sidebar_tab_profile',
    icon: 'account',
    link: 'profile'
  },
}


export default function SidebarMenu() {
  const [collapsed, setCollapsed] = React.useState(false);
  const { t } = useTranslation();
  const PROFILE_TABS_STYLE = { position: 'absolute', bottom: '0' };

  const logButton = () => {
    if (UserService.isLoggedIn()) {
      return (
        <ListItem id={`sidebar_tab_log_out`} className='listItem'>
            <ListItemButton component={Button} onClick={() => UserService.doLogout()}>
                <ListItemIcon className='icon'>
                  <LogoutOutlinedIcon  />
                </ListItemIcon>
                {!collapsed && <ListItemText primary={t("sidebar_tab_logout")} />}
            </ListItemButton>
        </ListItem>
      );
    } else {
      return (
        <ListItem id={`sidebar_tab_log_out`} className='listItem'>
            <ListItemButton component={Button} onClick={() => UserService.doLogin()}>
                <ListItemIcon className='icon'>
                  <LoginOutlinedIcon />
                </ListItemIcon>
                {!collapsed && <ListItemText primary={t("sidebar_tab_login")} />}
            </ListItemButton>
        </ListItem>
      );
    }
  }

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
        
        <Stack spacing={4} sx={{
          position: 'relative',
          top: '60px',
        }}>
          <Logo src='logoatts.png' collapsed={collapsed}></Logo>
          <Divider />

          <List>
            {Object.values(MAIN_TABS).map((tabInfo, index) => (
              !collapsed ? <Tab key={index} {...tabInfo}></Tab> : <CollapsedTab key={index} {...tabInfo}></CollapsedTab>
            ))}
          </List>

        </Stack>

        {!collapsed ? (
          <List sx={PROFILE_TABS_STYLE}>
            <Tab {...PROFILE_TABS.profile}></Tab>
            {logButton()}
          </List>) : (
          <List sx={PROFILE_TABS_STYLE}>
            <CollapsedTab {...PROFILE_TABS.profile}></CollapsedTab>
            {logButton()}
          </List>
        )}
      </Drawer>
    </Box>
  );
}
