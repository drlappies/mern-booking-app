import React, { createContext, useState } from 'react'
import { useSnackbar } from 'notistack';
import { useHistory } from 'react-router';
import axios from 'axios';

export const AuthenticationContext = createContext();

export function AuthenticationProvider(props) {
    const history = useHistory();
    const { enqueueSnackbar } = useSnackbar();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const handleLogout = () => {
        window.localStorage.removeItem('token')
        setIsAuthenticated(false);
        enqueueSnackbar(`再見！`, { variant: 'success', autoHideDuration: 1500 })
        history.push('/')
    }

    const handleRegister = async (username, password, title, permission) => {
        try {
            const payload = {
                username: username,
                password: password,
                permission: permission,
                title: title
            }
            await axios.post('/user/register', payload);
            const res = await axios.post('/user/login', payload, { withCredentials: true });
            window.localStorage.setItem('token', res.data.token);
            setIsAuthenticated(true);
            history.push('/')
        } catch (err) {
            enqueueSnackbar(`${err.response.data}`, { variant: 'error', autoHideDuration: 1500, anchorOrigin: { vertical: 'top', horizontal: 'center' }, preventDuplicate: true })
        }
    }

    const handleLogin = async (username, password) => {
        try {
            const payload = {
                username: username,
                password: password,
            }
            const res = await axios.post('/user/login', payload, { withCredentials: true });
            window.localStorage.setItem('token', res.data.token);
            setIsAuthenticated(true);
            enqueueSnackbar(`你好！${res.data.user.username}`, { variant: 'success', autoHideDuration: 1500, anchorOrigin: { vertical: 'top', horizontal: 'center' }, preventDuplicate: true })
            history.goBack();
        } catch (err) {
            enqueueSnackbar(`${err.response.data}`, { variant: 'error', autoHideDuration: 1500, anchorOrigin: { vertical: 'top', horizontal: 'center' }, preventDuplicate: true })
        }
    }

    const checkValidity = async () => {
        try {
            await axios.get('/user', { headers: { 'x-auth-token': window.localStorage.getItem('token') } })
        } catch (err) {
            enqueueSnackbar(`${err.response.data}`, { variant: 'warning', autoHideDuration: 1500, anchorOrigin: { vertical: 'top', horizontal: 'center' }, preventDuplicate: true })
            history.push('/login')
        }
    }

    return (
        <AuthenticationContext.Provider value={{ isAuthenticated, handleLogout, handleLogin, handleRegister, checkValidity }}>
            {props.children}
        </AuthenticationContext.Provider>
    )
}