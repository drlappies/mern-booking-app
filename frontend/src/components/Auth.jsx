import React, { useState, useContext } from 'react';
import { AuthenticationContext } from './contexts/AuthenticationContext';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import axios from 'axios'
import qs from 'qs'

function Auth() {
    // const { } = useContext(AuthenticationContext)
    const [form, setForm] = useState({
        username: '',
        password: '',
    })

    const handleChange = (e) => {
        const { name, value } = e.target
        setForm({
            ...form,
            [name]: value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const user = {
                username: form.username,
                password: form.password
            }
            const res = await axios.post('/user/login', qs.stringify(user), {
                headers: {
                    'content-type': 'application/x-www-form-urlencoded'
                },
                withCredentials: true
            })
            console.log(res)
        } catch (error) {
            if (error.response) {

                console.log(error.response)

            } else if (error.request) {

                console.log(error.request)

            } else if (error.message) {

                console.log(error.message)

            }
        }
    }
    return (
        <Paper>
            <form onSubmit={handleSubmit}>
                <TextField
                    id="username"
                    name="username"
                    label="帳號"
                    variant="outlined"
                    value={form.username}
                    onChange={handleChange}
                />
                <TextField
                    id="password"
                    name="password"
                    label="密碼"
                    type="password"
                    variant="outlined"
                    value={form.password}
                    onChange={handleChange}
                />
                <Button type="submit">登入</Button>
            </form>
        </Paper >
    )
}

export default Auth