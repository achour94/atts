import React from 'react';
import { CircularProgress, Box } from '@mui/material';

interface LoadingProps {
  size?: number; // Optional size prop to adjust the loading spinner size
}

const Loading: React.FC<LoadingProps> = ({ size = 40 }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%', // Adjust height and width as needed
        width: '100%',
      }}
    >
      <CircularProgress size={size} />
    </Box>
  );
};

export default Loading;
