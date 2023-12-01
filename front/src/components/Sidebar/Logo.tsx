import { Box } from "@mui/material"

interface LogoProps {
    src: string
}

export function Logo(props: LogoProps) {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', top: '20px' }}>
            <img src={props.src} alt="Logo" style={{ width: '153px', height: '43px' }}></img>
        </Box>
    )
}