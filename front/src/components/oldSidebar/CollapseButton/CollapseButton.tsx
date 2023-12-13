import IconButton from "@mui/material/IconButton";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import './CollapseButton.css';

interface CollapseButtonProps {
    collapsed: boolean,
    setCollapsed: React.Dispatch<React.SetStateAction<boolean>>,
}

export default function CollapseButton(props: CollapseButtonProps) {
    return (
        <IconButton
            className={`baseIconButtonStyles ${props.collapsed ? 'collapsedIconButtonStyles' : 'nonCollapsedIconButtonStyles'}`}
            onClick={() => props.setCollapsed(!props.collapsed)}
        >
            {props.collapsed ? <ArrowForwardIosIcon className="arrowStyle"/> : 
            <ArrowBackIosNewIcon className="arrowStyle"/>}
        </IconButton>
    );
}
