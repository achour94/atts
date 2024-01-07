import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import UserService from "../../services/UserService";
import { useSelector } from "react-redux";
import { Box, Button, Grid, Typography } from "@mui/material";
import Logo from "../../assets/images/logo.png";
import LoginOutlinedIcon from "@mui/icons-material/LoginOutlined";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useSelector((state) => state.auth);

  // This will hold the location they were redirected from, if available
  const from = location.state?.from?.pathname || "/";

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from);
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = () => {
    UserService.doLogin().then(() => {
      navigate(from);
    });
  };

  return (
    <Box
      sx={{
        height: "100vh",
        width: "100%",
        backgroundColor: "#FAFBFF",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box>
        <Box
          sx={{
            width: "20rem",
            mb: 5,
          }}
        >
          <img src={Logo} alt="logo" style={{ width: "100%" }} />
        </Box>
        <Box>
          <Button
            fullWidth
            size="large"
            variant="contained"
            startIcon={<LoginOutlinedIcon />}
            color={"primary"}
            sx={{
              borderRadius: "2rem",
              px: "1.5rem",
              py: "0.5rem",
            }}
            onClick={() => handleLogin()}
          >
            <Typography
              sx={{ fontSize: "0.75rem", fontWeight: 700, fontStyle: "normal" }}
            >
              Connexion
            </Typography>
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
