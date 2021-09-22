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
        padding: "30px"
    },
    button: {
        margin: "15px 0 15px 0"
    }
}))

function RegisterRoomfinder() {
    const classes = useStyles();
    const { handleRegisterFinder } = useContext(AuthenticationContext);
    const [form, setForm] = useState({
        username: '',
        password: '',
        name: '',
        confirmPassword: ''
    })

    const handleChange = (e) => {
        const { name, value } = e.target
        setForm({ ...form, [name]: value })
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        handleRegisterFinder(form.username, form.password, form.confirmPassword, form.name)
    }

    return (
        <Container>
            <Grid container justifyContent="center">
                <Grid item xl={5} lg={5} md={6} sm={7} xs={12}>
                    <Paper className={classes.form} elevation={4} >
                        <Typography variant="h6">建立普通用戶帳號</Typography>
                        <form noValidate autoComplete="off" onSubmit={handleSubmit}>
                            <TextField fullWidth margin="normal" name="username" size="small" label="登入名稱" variant="outlined" value={form.username} onChange={handleChange} />
                            <TextField fullWidth margin="normal" name="name" size="small" label="用戶別稱" variant="outlined" value={form.name} onChange={handleChange} />
                            <TextField fullWidth margin="normal" name="password" size="small" label="密碼" type="password" variant="outlined" value={form.password} onChange={handleChange} />
                            <TextField fullWidth margin="normal" name="confirmPassword" size="small" label="確認密碼" type="password" variant="outlined" value={form.confirmPassword} onChange={handleChange} />
                            <div className={classes.button}>
                                <Button fullWidth variant="contained" color="primary" type="submit">註冊</Button>
                            </div>
                        </form>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    )
}

export default RegisterRoomfinder