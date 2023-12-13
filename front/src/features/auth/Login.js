import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import UserService from '../../services/UserService';
import { useSelector } from 'react-redux';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useSelector((state) => state.auth);

  // This will hold the location they were redirected from, if available
  const from = location.state?.from?.pathname || '/';

    useEffect(() => {
        if (isAuthenticated) {
            navigate(from);
        }
    }
    , [isAuthenticated, navigate]);

  const handleLogin = () => {
    UserService.doLogin().then(() => {
      navigate(from);
    });
  };

  return (
    <div>
      <h1>Login Page</h1>
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Login;