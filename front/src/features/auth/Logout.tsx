import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UserService from '../../services/UserService';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    UserService.doLogout().then(() => {
      navigate('/login'); 
    });
  }, [navigate]);

  return (
    <div>
      Logging out...
    </div>
  );
};

export default Logout;
