import { Avatar, Box, Stack } from "@mui/material";
import React from "react";
import MuiButton from "../../components/Form/MuiButton";
import EditIcon from "@mui/icons-material/Edit";
import ClientAvatarCoverImage from "../../assets/images/ClientAvatarCover.png";

function Profile() {
  return (
    <Box
      sx={{
        backgroundColor: "#FFFFFF",
        borderRadius: "0.75rem",
        border: "1px solid #EAEEF4",
        width: "100%",
        height: "fit-content",
        p: 2,
        mt: 2,
      }}
    >
      <Box>
        <Box>
          <Stack direction="row" spacing={2} justifyContent={"flex-end"}>
            <MuiButton
              type="submit"
              color="primary"
              startIcon={<EditIcon />}
              label="Modifier"
            />
          </Stack>
        </Box>

        <Box>
          <Stack marginTop="1.25rem">
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                backgroundImage: `url(${ClientAvatarCoverImage})`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                backgroundPosition: "center",
                borderRadius: "0.5rem",
                width: "100%",
                height: "7.8125rem",
              }}
            >
              <Avatar
                alt="User avatar"
                // src="https://material-ui.com/static/images/avatar/1.jpg"
                sx={{
                  height: "6.25rem",
                  width: "6.25rem",
                  ml: "1.5rem",
                }}
              />
            </Box>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}

export default Profile;
