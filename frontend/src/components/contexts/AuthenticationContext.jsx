import React, { createContext, useState, useEffect } from 'react'
import { useSnackbar } from 'notistack';
import { useHistory } from 'react-router';
import axios from 'axios';

export const AuthenticationContext = createContext();

export function AuthenticationProvider(props) {
    const history = useHistory();
    const { enqueueSnackbar } = useSnackbar();
    const [state, setState] = useState({
        uid: '',
        username: '',
        permission: '',
        isAuthenticated: false
    })

    const handleLogout = () => {
        window.localStorage.removeItem('token')
        setState(prevState => {
            return {
                uid: '',
                username: '',
                permission: '',
                isAuthenticated: false
            }
        })
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
            const register = await axios.post('/user/register', payload);
            const res = await axios.post('/user/login', payload, { withCredentials: true });
            window.localStorage.setItem('token', res.data.token);
            setState({
                uid: res.data.userid,
                username: res.data.username,
                permission: res.data.permission,
                isAuthenticated: true
            })
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
            setState({
                uid: res.data.userid,
                username: res.data.username,
                permission: res.data.permission,
                isAuthenticated: true
            })
            enqueueSnackbar(`你好！${res.data.username}`, { variant: 'success', autoHideDuration: 1500, anchorOrigin: { vertical: 'top', horizontal: 'center' }, preventDuplicate: true })
            history.goBack();
        } catch (err) {
            enqueueSnackbar(`${err.response.data}`, { variant: 'error', autoHideDuration: 1500, anchorOrigin: { vertical: 'top', horizontal: 'center' }, preventDuplicate: true })
        }
    }

    const checkPermission = async (permission) => {
        try {
            const res = await axios.get('/user', { headers: { 'x-auth-token': window.localStorage.getItem('token') } });
            if (!res.data.permission) {
                history.push('/')
                enqueueSnackbar('權限不足', { variant: 'warning', autoHideDuration: 1500, anchorOrigin: { vertical: 'top', horizontal: 'center' }, preventDuplicate: true })
            }
        } catch (err) {
            enqueueSnackbar(`${err.response.data}`, { variant: 'warning', autoHideDuration: 1500, anchorOrigin: { vertical: 'top', horizontal: 'center' }, preventDuplicate: true })
            history.push('/')
        }
    }

    const fetchUser = async () => {
        try {
            if (window.localStorage.getItem('token')) {
                const res = await axios.get('/user', {
                    headers: {
                        'x-auth-token': window.localStorage.getItem('token')
                    }
                })
                setState({
                    uid: res.data.userid,
                    username: res.data.username,
                    permission: res.data.permission,
                    isAuthenticated: true
                })
            } else {
                setState({
                    uid: '',
                    username: '',
                    permission: '',
                    isAuthenticated: false
                })
            }
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        fetchUser()
    }, [])

    return (
        <AuthenticationContext.Provider value={{ state, handleLogout, handleLogin, handleRegister, checkPermission, fetchUser }}>
            {props.children}
        </AuthenticationContext.Provider>
    )
}