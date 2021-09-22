import React, { useState, useContext } from 'react';
import Container from '@material-ui/core/Container'
import { AuthenticationContext } from './contexts/AuthenticationContext';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import TextField from '@material-ui/core/TextField';

function Login() {
    const { handleLogin } = useContext(AuthenticationContext);
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

    const handleSubmit = () => {
        handleLogin(form.username, form.password)
    }

    return (
        <Container>
            <Grid container justifyContent="center">
                <Grid item xl={3} lg={3} md={4} sm={5} xs={12}>
                    <Card>
                        <CardContent>
                            <TextField
                                margin="normal"
                                fullWidth
                                size="small"
                                id="username"
                                name="username"
                                label="帳號"
                                variant="outlined"
                                value={form.username}
                                onChange={handleChange}
                            />
                            <TextField
                                margin="normal"
                                fullWidth
                                size="small"
                                id="password"
                                name="password"
                                label="密碼"
                                type="password"
                                variant="outlined"
                                value={form.password}
                                onChange={handleChange}
                            />
                        </CardContent>
                        <CardActions>
                            <Button onClick={handleSubmit} fullWidth variant="contained" color="primary">登入</Button>
                            <Button component={Link} to="/user/register" fullWidth variant="contained" color="primary">註冊</Button>
                        </CardActions>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    )
}

export default Login