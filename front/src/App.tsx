import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import ClientDetails from "./features/clients/ClientDetails";
import Login from "./features/auth/Login";
import ProtectedRoute from "./components/ProtectedRoutes";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { initializeAuth, selectUserRoles } from "./features/auth/authSlice";
import Layout from "./components/Layout";
import ProtectedLayout from "./components/ProtectedLayout";
import MissingPage from "./components/MissingPage";
import { ThemeProvider } from "@mui/material";
import theme from "./theme";
import Clients from "./features/clients/Clients";
import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import Logout from "./features/auth/Logout";
import Invoices from "./features/invoices/Invoices";
import InvoiceDetail from "./features/invoice/InvoiceDetail";
import Profile from "./features/profile/Profile";
import RequireAuth from "./features/auth/RequireAuth";
import NotAllowed from "./components/NotAllowed";
import { ROLES } from "./lib/constants/utilsConstants";
import useRole from "./hooks/useRole";



function App() {
  const dispatch = useDispatch();

  const isAdmin = useRole([ROLES.ADMIN]);

  useEffect(() => {
    initializeAuth(dispatch);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="login" element={<Login />} />
          <Route path="notAllowed" element={<NotAllowed />} />
          <Route element={<ProtectedRoute />}>
            {
              isAdmin ? <Route path="/" element={<Navigate to="/clients" replace />} />
                : <Route path="/" element={<Navigate to="/invoices" replace />} />
            }
            <Route element={<ProtectedLayout />}>
              <Route element={<RequireAuth allowedRoles={[ROLES.ADMIN]} />}>
                <Route path="clients" element={<Clients />} />
                <Route path="client/:id" element={<ClientDetails />} />
              </Route>
              <Route path="/logout" element={<Logout />} />
              <Route path="invoices" element={<Invoices />} />
              <Route path="invoice/:id" element={<InvoiceDetail />} />
              <Route path="profile" element={<Profile />} />
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
