import React from 'react'
import { Avatar, Box, Stack } from '@mui/material'
import ClientAvatarCoverImage from '../../assets/images/ClientAvatarCover.png';

function ClientAvatar() {
  return (
    <Stack marginTop="1.25rem" >
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                backgroundImage: `url(${ClientAvatarCoverImage})`,
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                borderRadius: "0.5rem",
                width: "100%",
                height: "7.8125rem",
            }}
        >
        <Avatar
            alt="Client avatar"
            src="https://material-ui.com/static/images/avatar/1.jpg"
            sx={{
                height: "6.25rem",
                width: "6.25rem",
                ml: "1.5rem",
            }}
        />

        </Box>
    </Stack>
  )
}

export default ClientAvatar