import React, { useState, useEffect, useCallback } from 'react';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import axios from 'axios'

const useStyles = makeStyles(() => ({
    form: {
        width: "300px",
        height: "auto",
        padding: "30px"
    }
}))

function User() {
    const classes = useStyles();
    const [state, setState] = useState({
        isLoading: true,
        isOnboarded: false,
        uid: '',
        username: '',
        permission: '',
        email: '',
    });

    const handleOnboard = async () => {
        try {
            const res = await axios.get('/transaction/onboard', {
                headers: {
                    'x-auth-token': window.localStorage.getItem('token')
                }
            });
            window.location = res.data.url
        } catch (err) {
            console.log(err)
        }
    }

    const fetchUser = useCallback(async () => {
        try {
            const res = await axios.get('/user', {
                headers: {
                    'x-auth-token': window.localStorage.getItem('token')
                }
            })
            setState(prevState => {
                return {
                    ...prevState,
                    uid: res.data.userid,
                    username: res.data.username,
                    permission: res.data.permission,
                    stripe_id: res.data.stripe_id
                }
            })
            console.log(res)
        } catch (err) {
            console.log(err)
        }
    }, [])

    const fetchOnboardStatus = useCallback(async () => {
        try {
            const res = await axios.get('/transaction/onboardstatus', {
                headers: {
                    'x-auth-token': window.localStorage.getItem('token')
                }
            });
            setState(prevState => {
                return {
                    ...prevState,
                    isOnboarded: res.data.isOnboarded,
                    email: res.data.email
                }
            })
        } catch (err) {
            console.log(err)
        }
    }, [])

    useEffect(() => {
        fetchUser()
        fetchOnboardStatus()
    }, [fetchOnboardStatus, fetchUser])

    return (
        <Container>
            <Grid container justify="center">
                <Paper className={classes.form}>
                    <List>
                        <ListItem>
                            <ListItemText
                                primary={'uid'}
                                secondary={state.uid}
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemText
                                primary={'用戶名稱'}
                                secondary={state.username}
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemText
                                primary={'用戶身份'}
                                secondary={state.permission === 'Owner' ? '商家' : '普通用戶'}
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemText
                                primary={'Stripe 連結狀態'}
                                secondary={state.isOnboarded ? '已連結' : '未連結'}
                            />
                            {state.isOnboarded ? null :
                                <ListItemSecondaryAction>
                                    <Button variant="contained" onClick={() => handleOnboard()}>與Stripe連結</Button>
                                </ListItemSecondaryAction>
                            }
                        </ListItem>
                        {!state.isOnboarded ? null :
                            <ListItem>
                                <ListItemText
                                    primary={'Stripe 連結電郵'}
                                    secondary={state.email}
                                />
                            </ListItem>
                        }
                    </List>
                </Paper>
            </Grid>
        </Container>
    )
}

export default User