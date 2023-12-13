// theme.ts
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#157EB5', // Example Primary Color
      dark: '#2B3674', // Example Primary Dark Color
    },
    secondary: {
      main: '#EE7F01', // Example Secondary Color
    },
    error: {
      main: '#D92D20', // Error Color
    },
    warning: {
      main: '#FFA726', // Warning Color (Adjusted for better visibility)
    },
    info: {
      main: '#A3AED0', // Info Color
    },
    success: {
      main: '#07A104', // Success Color
    },
    background: {
      default: '#FAFBFF', // Background Color
      paper: '#F4F7FE', // Paper Color
    },
    text: {
      primary: '#030229', // Primary Text Color
      secondary: '#2C2C2C', // Secondary Text Color
      disabled: '#BDBDBD', // Disabled Text Color
    },
    divider: '#D9D9D9', // Divider Color
  },
  // You can also customize typography, breakpoints, etc.
});

export default theme;
