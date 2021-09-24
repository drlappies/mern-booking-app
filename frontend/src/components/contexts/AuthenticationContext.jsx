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
        setState({
            uid: '',
            username: '',
            permission: '',
            isAuthenticated: false
        })
        enqueueSnackbar(`再見！`, { variant: 'success', autoHideDuration: 1500 })
        history.push('/')
    }

    const handleRegisterFinder = async (username, password, confirmPassword, name) => {
        try {
            const payload = {
                username: username,
                password: password,
                confirmPassword: confirmPassword,
                name: name
            }
            const res = await axios.post('/api/user/finder', payload)
            enqueueSnackbar(res.data.success, { variant: 'success', autoHideDuration: 1500, anchorOrigin: { vertical: 'top', horizontal: 'center' }, preventDuplicate: true })
            history.push('/user/login')
        } catch (err) {
            enqueueSnackbar(`${err.response.data.error}`, { variant: 'error', autoHideDuration: 1500, anchorOrigin: { vertical: 'top', horizontal: 'center' }, preventDuplicate: true })
        }
    }

    const handleRegisterOwner = async (username, password, confirmPassword, title) => {
        try {
            const payload = {
                username: username,
                password: password,
                confirmPassword: confirmPassword,
                title: title
            }
            const res = await axios.post('/api/user/owner', payload)
            enqueueSnackbar(res.data.success, { variant: 'success', autoHideDuration: 1500, anchorOrigin: { vertical: 'top', horizontal: 'center' }, preventDuplicate: true })
            history.push('/user/login')
        } catch (err) {
            enqueueSnackbar(`${err.response.data.error}`, { variant: 'error', autoHideDuration: 1500, anchorOrigin: { vertical: 'top', horizontal: 'center' }, preventDuplicate: true })
        }
    }

    const handleLogin = async (username, password) => {
        try {
            const payload = {
                username: username,
                password: password,
            }
            const res = await axios.post('/api/auth', payload, { withCredentials: true });
            window.localStorage.setItem('token', res.data.token);
            setState({
                uid: res.data.userid,
                username: res.data.username,
                permission: res.data.permission,
                isAuthenticated: true
            })
            enqueueSnackbar(`你好！${res.data.username}`, { variant: 'success', autoHideDuration: 1500, anchorOrigin: { vertical: 'top', horizontal: 'center' }, preventDuplicate: true })
            history.push('/')
        } catch (err) {
            enqueueSnackbar(`${err.response.data.error}`, { variant: 'error', autoHideDuration: 1500, anchorOrigin: { vertical: 'top', horizontal: 'center' }, preventDuplicate: true })
        }
    }

    const fetchUser = async () => {
        try {
            if (window.localStorage.getItem('token')) {
                const res = await axios.get('/api/auth', {
                    headers: { 'x-auth-token': window.localStorage.getItem('token') }
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
        <AuthenticationContext.Provider value={{ state, handleLogout, handleLogin, fetchUser, handleRegisterFinder, handleRegisterOwner }}>
            {props.children}
        </AuthenticationContext.Provider>
    )
}