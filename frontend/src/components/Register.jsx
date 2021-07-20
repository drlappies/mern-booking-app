import React, { useState, useContext } from 'react';
import { AuthenticationContext } from './contexts/AuthenticationContext';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
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

function Register() {
    const classes = useStyles();
    const { handleRegister } = useContext(AuthenticationContext);
    const [form, setForm] = useState({
        username: '',
        password: '',
        confirmPassword: ''
    })

    const [error, setError] = useState({
        usernameIsError: false,
        usernameError: '',
        passwordIsError: false,
        passwordError: '',
        confirmPasswordIsError: false,
        confirmPasswordError: ''
    });

    const handleValidate = () => {
        if (!form.username) {
            console.log('username validation')
            setError(error => ({
                ...error,
                usernameIsError: true,
                usernameError: '用戶名稱不能留空'
            }))
        }
        if (!form.password) {
            console.log('password validation')
            setError(error => ({
                ...error,
                passwordIsError: true,
                passwordError: '密碼不能留空'
            }))
        }
        if (!form.confirmPassword) {
            console.log('confirm password validation')
            setError(error => ({
                ...error,
                confirmPasswordIsError: true,
                confirmPasswordError: '確認密碼不能留空'
            }))
            return false;
        }
        // if (form.confirmPassword !== form.password) {
        //     setError({
        //         ...error,
        //         confirmPasswordIsError: true,
        //         confirmPasswordError: '確認密碼與密碼不相同'
        //     })
        //     return false;
        // }
        return true;
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setForm({
            ...form,
            [name]: value
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(error)
        const isFormValid = handleValidate();
        console.log(isFormValid)
        if (isFormValid) {
            handleRegister(form.username, form.password)
        }
    }

    console.log(error);

    return (
        <Container>
            <Grid
                container
                justify="center"
            >
                <Grid item>
                    <Paper className={classes.paper} elevation={3} >
                        <form noValidate autoComplete="off" onSubmit={handleSubmit}>
                            <TextField
                                error={error.usernameIsError}
                                helperText={error.usernameError}
                                className={classes.input}
                                fullWidth
                                required
                                name="username"
                                size="small"
                                label="帳號"
                                variant="outlined"
                                value={form.username}
                                onChange={handleChange}
                            />
                            <TextField
                                error={error.passwordIsError}
                                helperText={error.passwordError}
                                className={classes.input}
                                fullWidth
                                required
                                name="password"
                                size="small"
                                label="密碼"
                                type="password"
                                variant="outlined"
                                value={form.password}
                                onChange={handleChange}
                            />
                            <TextField
                                error={error.confirmPasswordIsError}
                                helperText={error.confirmPasswordError}
                                className={classes.input}
                                fullWidth
                                required
                                name="confirmPassword"
                                size="small"
                                label="確認密碼"
                                type="password"
                                variant="outlined"
                                value={form.confirmPassword}
                                onChange={handleChange}
                            />
                            <Button className={classes.button} fullWidth variant="contained" color="primary" type="submit">註冊</Button>
                        </form>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    )
}

export default Register