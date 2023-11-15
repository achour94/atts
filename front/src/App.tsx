import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Public from './components/Public'
import Login from './features/auth/Login'
import Welcome from './features/auth/Welcome'
import RequireAuth from './features/auth/RequireAuth'
import UsersList from './features/users/UsersList'
import { initKeycloack } from './features/auth/authSlice'

import { useDispatch } from 'react-redux'


function App() {

    const dispatch = useDispatch();

    // useEffect(() => {
    //     initKeycloack(dispatch);
    // }, [dispatch]);
    
    
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                {/* public routes */}
                <Route index element={<Public />} />
                <Route path="login" element={<Login />} />

                {/* protected routes */}
                <Route element={<RequireAuth />}>
                    <Route path="welcome" element={<Welcome />} />
                    <Route path="userslist" element={<UsersList />} />
                </Route>

            </Route>
        </Routes>
    )
}

export default App;