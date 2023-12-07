import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
// import Layout from './components/Layout'
// import Public from './components/Public'
// // import Welcome from './features/auth/Welcome'
// // import UsersList from './features/users/UsersList';
import CssBaseline from '@mui/material/CssBaseline';
import SidebarMenu from "./components/Sidebar/Sidebar";
import Box from '@mui/material/Box';
import ContentPlaceholder from './components/ContentPlaceholder';


import { useDispatch } from 'react-redux'
import RenderOnAuthenticated from './components/RenderOnAuthenticated'
import RenderOnRole from './components/RenderOnRole'
import UserService from './services/UserService'



function App(keycloak: any) {

    
    
    return (
        <Box id='root'>
            <CssBaseline/>
            <SidebarMenu ></SidebarMenu>
            <Routes>
                <Route path='/' element={<ContentPlaceholder name='MAIN PAGE'></ContentPlaceholder>} />
                <Route path='/dashboard' element={<ContentPlaceholder name='DASHBOARD'></ContentPlaceholder>} />
                <Route path='/clients' element={<ContentPlaceholder name='CLIENTS'></ContentPlaceholder>} />
                <Route path='/invoices' element={<ContentPlaceholder name='INVOICES'></ContentPlaceholder>} />
                <Route path='/history' element={<ContentPlaceholder name='HISTORY'></ContentPlaceholder>} />
                <Route path='/profile' element={<ContentPlaceholder name='PROFILE'></ContentPlaceholder>} />
                {/* <Route path="/" element={<Layout />}>
                    {/* public routes */}
                    {/* <Route index element={<Public />} />
                    <Route path="login" element={<Login />} /> */}

                    {/* protected routes */}
                    {/* <Route element={<RequireAuth />}>
                        <Route path="welcome" element={<Welcome />} />
                        <Route path="userslist" element={<UsersList />} />
                    </Route> */}

                {/* </Route> */}
            </Routes>
        </Box>
    )
}

export default App;