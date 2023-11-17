import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Public from './components/Public'
import Welcome from './features/auth/Welcome'
import UsersList from './features/users/UsersList'

import { useDispatch } from 'react-redux'
import RenderOnAuthenticated from './components/RenderOnAuthenticated'
import RenderOnRole from './components/RenderOnRole'
import UserService from './services/UserService'



function App(keycloak: any) {

    
    
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route path="/" element={<Public/>}/>
                {/* <Route index element={<Public />} /> */}
                    <Route path="welcome" element={<RenderOnAuthenticated><Welcome /></RenderOnAuthenticated>} />
                    <Route path="userslist" element={<RenderOnRole showNotAllowed={true} roles={["admin"]}><UsersList /></RenderOnRole>} />
            </Route>
        </Routes>
    )
}

export default App;