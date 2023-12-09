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



function App(keycloak: any) {
    return (
        <Box id='root'>
            <CssBaseline/>
            <SidebarMenu ></SidebarMenu>
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


                {/* protected routes */}
                {/* <Route>
                    <Route path="welcome" element={<Welcome />} />
                    <Route path="userslist" element={<UsersList />} />
                </Route> */}
            </Routes>
        </Box>
    )
}

export default App;