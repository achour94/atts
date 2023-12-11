import { Routes, Route } from 'react-router-dom'
import Public from './components/Public'
import CssBaseline from '@mui/material/CssBaseline';
import SidebarMenu from "./components/Sidebar/Sidebar";
import Box from '@mui/material/Box';
import Invoices from './components/pages/invoices/Invoices';
import Dashboard from './components/pages/Dashboard';
import Clients from './components/pages/clients/Clients';
import History from './components/pages/History';
import Profile from './components/pages/Profile';
import ClientDetails from './components/pages/ClientDetails';
//import InvoiceDetails from './components/pages/invoices/InvoiceDetails';



function App(keycloak: any) {
    return (
        <Box sx={{
            display: 'flex',
            height: '100vh',
            width: '100vw'
        }}>
            <CssBaseline/>
            <Box display={"flex"} width="100%" height="100%">
                <SidebarMenu ></SidebarMenu>
                <Box flexGrow={1} sx={{display: "flex", backgroundColor: "#FAFBFF", padding: 2}} >
                    <Routes>
                        {/* public routes */}
                        <Route index element={<Public />} />
                        {/* <Route path="login" element={<Login />} /> */}
                        <Route path='/' element={<Dashboard name="DASHBOARD"></Dashboard>} />
                        <Route path='/dashboard' element={<Dashboard name="DASHBOARD"></Dashboard>} />
                        <Route path='/clients' element={<Clients name="CLIENTS"></Clients>} />
                        <Route path='/invoices' element={<Invoices/>} />
                        <Route path='/history' element={<History name="HISTORY"></History>} />
                        <Route path='/profile' element={<Profile name="PROFILE"></Profile>} />
                        <Route path='/client/:id' element={<ClientDetails />} />


                        {/* protected routes */}
                        {/* <Route>
                            <Route path="welcome" element={<Welcome />} />
                            <Route path="userslist" element={<UsersList />} />
                        </Route> */}
                    </Routes>
                </Box>
            </Box>
        </Box>
    )
}

export default App;