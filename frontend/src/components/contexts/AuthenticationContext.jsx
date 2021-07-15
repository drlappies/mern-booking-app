import React, { createContext, useState } from 'react'
import axios from 'axios';

export const AuthenticationContext = createContext();

export function AuthenticationProvider(props) {
    const [user, setUser] = useState(undefined);

    const handleLogout = async (e) => {
        try {
            await axios.post('/user/logout');
            setUser(undefined);
        } catch (err) {
            console.log(err)
        }
    }

    const handleRegister = async (e, username, password) => {
        try {
            const user = {
                username: username,
                password: password
            }
            const req = axios.post('/user/register', user);
            if (req.user) {
                setUser(req.user)
            }
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <AuthenticationContext.Provider value={{}}>
            {props.children}
        </AuthenticationContext.Provider>
    )
}