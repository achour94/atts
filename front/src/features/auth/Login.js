import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectIsAuthenticated, initKeycloack } from './authSlice';

const Login = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/welcome'); // Redirect to a welcome or dashboard page
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = () => {
    // dispatch(initiateLogin()); // Dispatch an action to initiate login
    initKeycloack(dispatch);
  };

  return (
    <div>
      <h1>Login</h1>
      <button onClick={handleLogin}>Login with Keycloak</button>
    </div>
  );
};

export default Login;
