import React from 'react';
import { Link } from 'react-router-dom';
import { styled } from '@mui/material/styles';

const CustomLink = styled(Link)(({ theme }) => ({
  color: theme.palette.primary.dark,
  fontWeight: 500,
  textDecoration: 'none',
  '&:hover': {
    color: theme.palette.info.main, 
    textDecoration: 'underline',
  },
}));

const StyledLink: React.FC<{ to: string; children: React.ReactNode }> = ({ to, children }) => {
  return <CustomLink to={to}>{children}</CustomLink>;
};

export default StyledLink;
