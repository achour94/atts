import { Box } from "@mui/material"

interface LogoProps {
    src: string,
    collapsed: boolean,
}

export function Logo(props: LogoProps) {
    const logoStyle = !props.collapsed ? { width: '153px', height: '43px' } : { width: '70px', height: '33px' };

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', top: '20px' }}>
            <img src={props.src} alt="Logo" style={logoStyle}></img>
        </Box>
    )
}