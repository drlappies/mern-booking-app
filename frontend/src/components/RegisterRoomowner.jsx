import React, { useState, useContext } from 'react';
import { AuthenticationContext } from './contexts/AuthenticationContext';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
    form: {
        width: "300px",
        height: "auto",
        padding: "30px"
    },
    input: {
        margin: '15px 0px 15px 0px'
    },
    button: {
        margin: "15px 0 15px 0"
    }
}))

function RegisterRoomowner() {
    const classes = useStyles();
    const { handleRegister } = useContext(AuthenticationContext);
    const [form, setForm] = useState({
        username: '',
        password: '',
        confirmPassword: '',
        title: '',
        email: '',
    })

    const [error, setError] = useState({
        emailIsError: false,
        emailError: '',
        usernameIsError: false,
        usernameError: '',
        passwordIsError: false,
        passwordError: '',
        confirmPasswordIsError: false,
        confirmPasswordError: '',
        titleIsError: false,
        titleError: ''
    });

    const handleValidate = () => {
        const format = new RegExp(/[ !@#$%^&*()_+\-=\\[\]{};':"\\|,.<>\\/?]/g);
        if (!form.username) {
            setError(error => ({
                ...error,
                usernameIsError: true,
                usernameError: '用戶名稱不能留空'
            }))
        }
        if (!form.email) {
            setError(error => ({
                ...error,
                emailIsError: true,
                emailError: '電郵地址不能留空'
            }))
        }
        if (format.test(form.username)) {
            setError(error => ({
                ...error,
                usernameIsError: true,
                usernameError: '用戶名稱不能有特殊符號'
            }))
        }
        if (!form.password) {
            setError(error => ({
                ...error,
                passwordIsError: true,
                passwordError: '密碼不能留空'
            }))
        }
        if (!form.title) {
            setError(error => ({
                ...error,
                titleIsError: true,
                titleError: '店家名稱不能留空'
            }))
        }
        if (!form.confirmPassword) {
            setError(error => ({
                ...error,
                confirmPasswordIsError: true,
                confirmPasswordError: '確認密碼不能留空'
            }))
            return false
        }
        if (form.confirmPassword !== form.password) {
            setError({
                ...error,
                confirmPasswordIsError: true,
                confirmPasswordError: '確認密碼與密碼不相同'
            })
            return false
        }
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
        const isFormValid = handleValidate();
        if (isFormValid) {
            handleRegister(form.email, form.username, form.password, form.title, 'owner')
        }
    }

    return (
        <Container>
            <Grid container justify='center'>
                <Paper className={classes.form} elevation={4} >
                    <Typography variant="h6">建立店家用戶帳號</Typography>
                    <form noValidate autoComplete="off" onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            className={classes.input}
                            error={error.emailIsError}
                            helperText={error.emailError}
                            name="email"
                            size="small"
                            type="email"
                            label="電郵地址"
                            variant="outlined"
                            value={form.email}
                            onChange={handleChange}
                        />
                        <TextField
                            fullWidth
                            className={classes.input}
                            error={error.usernameIsError}
                            helperText={error.usernameError}
                            name="username"
                            type="text"
                            size="small"
                            label="帳號"
                            variant="outlined"
                            value={form.username}
                            onChange={handleChange}
                        />
                        <TextField
                            fullWidth
                            className={classes.input}
                            error={error.passwordIsError}
                            helperText={error.passwordError}
                            name="password"
                            size="small"
                            label="密碼"
                            type="password"
                            variant="outlined"
                            value={form.password}
                            onChange={handleChange}
                        />
                        <TextField
                            fullWidth
                            className={classes.input}
                            error={error.confirmPasswordIsError}
                            helperText={error.confirmPasswordError}
                            name="confirmPassword"
                            size="small"
                            label="確認密碼"
                            type="password"
                            variant="outlined"
                            value={form.confirmPassword}
                            onChange={handleChange}
                        />
                        <TextField
                            fullWidth
                            className={classes.input}
                            error={error.titleIsError}
                            helperText={error.titleError}
                            name="title"
                            size="small"
                            label="店家名稱"
                            type="text"
                            variant="outlined"
                            value={form.title}
                            onChange={handleChange}
                        />
                        <div className={classes.input}>
                            <Button fullWidth variant="contained" color="primary" type="submit">註冊</Button>
                        </div>
                    </form>
                </Paper>
            </Grid>
        </Container>
    )
}

export default RegisterRoomowner