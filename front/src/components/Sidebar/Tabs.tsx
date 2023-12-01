import HomeIcon from '@mui/icons-material/Home';
import GroupIcon from '@mui/icons-material/Group';
import DescriptionIcon from '@mui/icons-material/Description';
import HistoryIcon from '@mui/icons-material/History';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

import Tooltip from '@mui/material/Tooltip';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { Link } from 'react-router-dom';
import { useTranslation } from "react-i18next";

interface TabIconProps {
    icon: string,
}

function TabIcon(props: TabIconProps) {
    let icon;
    switch (props.icon) {
        case 'home':
            icon = <HomeIcon></HomeIcon>
            break;
        case 'group':
            icon = <GroupIcon></GroupIcon>
            break;
        case 'description':
            icon = <DescriptionIcon></DescriptionIcon>
            break;
        case 'history':
            icon = <HistoryIcon></HistoryIcon>
            break;
        case 'account':
            icon = <AccountCircleIcon></AccountCircleIcon>
            break;
        default:
            icon = null;
            break;
    }
    return icon;
}

interface TabProps {
    text: string,
    icon: string,
    link: string,
}

export function Tab(props: TabProps) {
    const { t } = useTranslation();

    return (
        <ListItem>
            <ListItemButton component={Link} to={props.link}>
                <ListItemIcon>
                    <TabIcon icon={props.icon}></TabIcon>
                </ListItemIcon>
                <ListItemText primary={t(props.text)} />
            </ListItemButton>
        </ListItem>
    );
}

export function CollapsedTab(props: TabProps) {
    const { t } = useTranslation();

    return (
        <ListItem>
            <Tooltip title={t(props.text)} placement="right">
                <ListItemButton component={Link} to={props.link}>
                    <ListItemIcon>
                        <TabIcon icon={props.icon}></TabIcon>
                    </ListItemIcon>
                </ListItemButton>
            </Tooltip>
        </ListItem>
    );
}
