import React, { useState, useContext } from 'react';
import { AuthenticationContext } from './contexts/AuthenticationContext';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    paper: {
        width: "300px",
        height: "40vh",
        padding: "30px"
    },
    input: {
        margin: "15px 0 15px 0"
    },
    button: {
        margin: "15px 0 15px 0"
    }
})

function Auth() {
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
            <Grid
                container
                justify="center"
            >
                <Grid item>
                    <Paper className={classes.paper} elevation={3} >
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
                        <Button className={classes.button} onClick={handleSubmit} fullWidth variant="contained" color="primary">登入</Button>
                        <Typography>沒有帳號？立刻註冊：</Typography>
                        <Button className={classes.button} fullWidth variant="contained" color="primary">註冊</Button>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    )
}

export default Auth