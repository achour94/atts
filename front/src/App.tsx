import { Routes, Route } from "react-router-dom";
import Public from "./components/Public";
import CssBaseline from "@mui/material/CssBaseline";
import SidebarMenu from "./components/oldSidebar/Sidebar";
import Box from "@mui/material/Box";
import Invoices from "./components/pages/invoices/Invoices";
import Dashboard from "./components/pages/Dashboard";
import History from "./components/pages/History";
import Profile from "./components/pages/Profile";
import ClientDetails from "./components/pages/ClientDetails";
import Login from "./features/auth/Login";
import ProtectedRoute from "./components/ProtectedRoutes";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { initializeAuth } from "./features/auth/authSlice";
import Layout from "./components/Layout";
import ProtectedLayout from "./components/ProtectedLayout";
import MissingPage from "./components/MissingPage";
import { ThemeProvider } from "@mui/material";
import theme from "./theme";
import Clients from "./features/clients/Clients";
//import InvoiceDetails from './components/pages/invoices/InvoiceDetails';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    console.log("App.tsx: useEffect");
    initializeAuth(dispatch);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="login" element={<Login />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<ProtectedLayout />}>
              <Route index element={<Dashboard name="DASHBOARD" />} />
              <Route path="clients" element={<Clients />} />
              <Route path="invoices" element={<Invoices name="INVOICES" />} />
              <Route path="client/:id" element={<ClientDetails />} />
            </Route>
          </Route>
          {/* catch all */}
          <Route path="*" element={<MissingPage />} />
        </Route>
      </Routes>
    </ThemeProvider>
  );
}

export default App;
