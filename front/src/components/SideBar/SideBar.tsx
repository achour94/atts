import { Box, useTheme } from '@mui/material';
import React, { useState } from 'react'
import { Sidebar, Menu, MenuItem, SubMenu, MenuItemStyles, menuClasses } from 'react-pro-sidebar';
import { Link } from 'react-router-dom';
import SideBarHeader from './SideBarHeader/SideBarHeader';
import MenuElement, { IMenuElement } from './MenuElement/MenuElement';
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import ToggleButton from './ToggleButton/ToggleButton';
import { ROLES } from '../../lib/constants/utilsConstants';



const menuItems: IMenuElement[] = [
    // {
    //     label: "Mon dashboard",
    //     icon: <SpaceDashboardIcon />,
    //     path: "/"
    // },
    {
        label: "Mes clients",
        icon: <PeopleAltOutlinedIcon />,
        path: "/clients",
        allowedRoles: [ROLES.ADMIN]
    },
    {
        label: "Mes factures",
        icon: <DescriptionOutlinedIcon />,
        path: "/invoices",
        allowedRoles: [ROLES.ADMIN, ROLES.CLIENT]
    },
    {
        label: "Historique",
        icon: <HistoryOutlinedIcon />,
        path: "/history",
        allowedRoles: [ROLES.ADMIN]
    },
]

const profileItems: IMenuElement[] = [
    {
        label: "Profile",
        icon: <AccountCircleOutlinedIcon />,
        path: "/profile",
        allowedRoles: [ROLES.ADMIN, ROLES.CLIENT]
    },
    {
        label: "Se déconnecter",
        icon: <LogoutOutlinedIcon />,
        path: "/logout",
        allowedRoles: [ROLES.ADMIN, ROLES.CLIENT]
    },
]
function SideBar() {

    const theme = useTheme();
    const [collapsed, setCollapsed] = useState(false);

    const menuItemStyles: MenuItemStyles = {
        root: {
          backgroundColor: theme.palette.common.white,
          fontSize: '1rem',
          fontWeight: 500,
        },
        button: {
          fontSize: '1.125rem',
          fontWeight: 500,
          fontStyle: 'normal',
          color: theme.palette.info.main,
          marginBottom: '1rem',
          [`&.active`]: {
            borderRight: `0.25rem solid ${theme.palette.primary.main}`,
            color: theme.palette.primary.dark
          },
        },
    }

    const toggleCollapsed = () => {
        setCollapsed(!collapsed);
    }

  return (
    <Box sx={{ display: "flex", height: "100vh"}}>
        <Sidebar
            collapsed={collapsed}
        >
            <Box sx={{ display: "flex", flexDirection: "column", height: '100%', backgroundColor: 'common.white' }}>
              <ToggleButton toggleCollapsed={toggleCollapsed} collapsed={collapsed} />
                <SideBarHeader />
                <Box sx={{ flexGrow: 1 }} >
                    <Menu menuItemStyles={menuItemStyles}>
                        {menuItems.map((item, index) => (
                            <MenuElement label={item.label} icon={item.icon} path={item.path} key={index} allowedRoles={item.allowedRoles} />
                        ))}
                    </Menu>
                </Box>
                <Box sx={{ marginBottom: 5 }}>
                    <Menu menuItemStyles={menuItemStyles} >
                        {profileItems.map((item, index) => (
                            <MenuElement label={item.label} icon={item.icon} path={item.path} key={index} allowedRoles={item.allowedRoles} />
                        ))}
                    </Menu>
                </Box>
            </Box>
        </Sidebar>
    </Box>
  )
}

export default SideBar