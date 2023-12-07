import { Routes, Route } from 'react-router-dom'
import Public from './components/Public'
import Welcome from './features/auth/Welcome';
import UsersList from './features/users/UsersList';
import CssBaseline from '@mui/material/CssBaseline';
import SidebarMenu from "./components/Sidebar/Sidebar";
import Box from '@mui/material/Box';
import ContentPlaceholder from './components/ContentPlaceholder';


import { useDispatch } from 'react-redux'
import RenderOnAuthenticated from './components/RenderOnAuthenticated'
import RenderOnRole from './components/RenderOnRole'
import UserService from './services/UserService'
import Invoices from './components/Invoices';



function App(keycloak: any) {
    return (
        <Box id='root'>
            <CssBaseline/>
            <SidebarMenu ></SidebarMenu>
            <Routes>
                {/* public routes */}
                <Route index element={<Public />} />
                {/* <Route path="login" element={<Login />} /> */}
                <Route path='/' element={<ContentPlaceholder name='MAIN PAGE'></ContentPlaceholder>} />
                <Route path='/dashboard' element={<ContentPlaceholder name='DASHBOARD'></ContentPlaceholder>} />
                <Route path='/clients' element={<ContentPlaceholder name='CLIENTS'></ContentPlaceholder>} />
                <Route path='/invoices' element={<Invoices/>} />
                <Route path='/history' element={<ContentPlaceholder name='HISTORY'></ContentPlaceholder>} />
                <Route path='/profile' element={<ContentPlaceholder name='PROFILE'></ContentPlaceholder>} />

                {/* protected routes */}
                <Route>
                    <Route path="welcome" element={<Welcome />} />
                    <Route path="userslist" element={<UsersList />} />
                </Route>
            </Routes>
        </Box>
    )
}

export default App;