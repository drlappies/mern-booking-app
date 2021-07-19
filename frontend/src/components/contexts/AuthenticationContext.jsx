import React, { createContext, useState, useEffect } from 'react'
import { useSnackbar } from 'notistack';
import { useHistory } from 'react-router';
import axios from 'axios';

export const AuthenticationContext = createContext();

export function AuthenticationProvider(props) {
    const history = useHistory();
    const { enqueueSnackbar } = useSnackbar();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isRoomOwner, setIsRoomOwner] = useState(false);
    const [username, setUsername] = useState('');

    const handleLogout = async (e) => {
        try {
            const res = await axios.post('/user/logout');
            console.log(res)
            if (res.status === 200) {
                setIsLoggedIn(false);
                setIsAdmin(false);
                setIsRoomOwner(false);
                setUsername('');
                enqueueSnackbar(`再見！`, { variant: 'success', autoHideDuration: 1500 })
                history.push('/')
            }
        } catch (err) {
            console.log(err)
        }
    }

    const handleRegister = async (username, password) => {
        try {
            const user = {
                username: username,
                password: password
            }
            const res = await axios.post('/user/register', user);
            console.log(res)
            if (res.data) {
                setIsLoggedIn(false);
                setIsAdmin(res.data.isAdmin);
                setIsRoomOwner(res.data.isRoomOwner);
                setUsername(res.data.username);
            }
        } catch (err) {
            console.log(err)
        }
    }

    const handleLogin = async (username, password) => {
        try {
            const user = {
                username: username,
                password: password
            }
            const res = await axios.post('/user/login', user, {
                withCredentials: true
            })
            if (res.status === 200) {
                setIsLoggedIn(true);
                setIsAdmin(res.data.isAdmin);
                setIsRoomOwner(res.data.isRoomOwner);
                setUsername(res.data.username);
                enqueueSnackbar(`歡迎！${username}`, { variant: 'success', autoHideDuration: 1500 })
                history.goBack();
            } 
        } catch (err) {
            enqueueSnackbar('用戶名稱或密碼錯誤！', {
                variant: 'error',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center'
                },
                autoHideDuration: 1000
            });
        }
    }

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get('/user/currentuser');
                if (res.data) {
                    setIsLoggedIn(true);
                    setIsAdmin(res.data.isAdmin);
                    setIsRoomOwner(res.data.isRoomOwner);
                    setUsername(res.data.username);
                }
            } catch (err) {
                console.log(err)
            }
        }
        fetchUser()
    }, [])

    return (
        <AuthenticationContext.Provider value={{ isLoggedIn, isAdmin, isRoomOwner, username, handleLogout, handleLogin, handleRegister }}>
            {props.children}
        </AuthenticationContext.Provider>
    )
}