import React, { useState, useContext } from 'react';
import Container from '@material-ui/core/Container'
import { AuthenticationContext } from './contexts/AuthenticationContext';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    form: {
        width: "300px",
        height: "auto",
        padding: "30px"
    },
    input: {
        margin: "15px 0 15px 0"
    },
})

function Login() {
    const classes = useStyles();
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
            <Grid container justify="center">
                <Grid item>
                    <Paper className={classes.form} elevation={3} >
                        <TextField
                            className={classes.input}
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
                            className={classes.input}
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
                        <Button className={classes.input} onClick={handleSubmit} fullWidth variant="contained" color="primary">登入</Button>
                        <Typography>沒有帳號？</Typography>
                        <Button component={Link} to="/register" className={classes.button} fullWidth variant="contained" color="primary">註冊</Button>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    )
}

export default Login