import React, { useState, useEffect, useCallback, useContext } from 'react';
import { AuthenticationContext } from './contexts/AuthenticationContext'
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import Button from '@material-ui/core/Button';
import { useSnackbar } from 'notistack';
import axios from 'axios'

function User() {
    const { enqueueSnackbar } = useSnackbar();
    const auth = useContext(AuthenticationContext)
    const [state, setState] = useState({
        isLoading: true,
        isOnboarded: false,
        email: ""
    });

    const handleOnboard = async () => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_API_ENDPOINT}/api/transaction/${auth.state.uid}/onboard`, {
                headers: { 'x-auth-token': window.localStorage.getItem('token') }
            });
            window.location = res.data.url
        } catch (err) {
            enqueueSnackbar(err.response.data.error, { variant: 'error', autoHideDuration: 1500, anchorOrigin: { vertical: 'top', horizontal: 'center' }, preventDuplicate: true })
        }
    }

    const fetchOnboardStatus = useCallback(async () => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_API_ENDPOINT}/api/transaction/${auth.state.uid}/status`, {
                headers: { 'x-auth-token': window.localStorage.getItem('token') }
            });
            setState(prevState => {
                return {
                    ...prevState,
                    isOnboarded: res.data.isOnboarded,
                    email: res.data.email
                }
            })
        } catch (err) {
            enqueueSnackbar(err.response.data.error, { variant: 'error', autoHideDuration: 1500, anchorOrigin: { vertical: 'top', horizontal: 'center' }, preventDuplicate: true })
        }
    }, [auth.state.uid, enqueueSnackbar])

    useEffect(() => {
        fetchOnboardStatus()
    }, [fetchOnboardStatus])

    return (
        <Container>
            <Grid container justifyContent="center">
                <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                    <Card raised>
                        <CardContent>
                            <List>
                                <ListItem>
                                    <ListItemText primary={'ID'} secondary={auth.state.uid} />
                                </ListItem>
                                <ListItem>
                                    <ListItemText primary={'用戶名稱'} secondary={auth.state.username} />
                                </ListItem>
                                <ListItem>
                                    <ListItemText primary={'用戶身份'} secondary={auth.state.permission === 'Owner' ? '商家' : '普通用戶'} />
                                </ListItem>
                                {auth.state.permission === 'Finder' ?
                                    null
                                    :
                                    <React.Fragment>
                                        <ListItem>
                                            <ListItemText
                                                primary={'Stripe 連結狀態'}
                                                secondary={state.isOnboarded ? '已連結' : '未連結'}
                                            />
                                            {state.isOnboarded ? null :
                                                <ListItemSecondaryAction>
                                                    <Button variant="contained" color="primary" onClick={() => handleOnboard()}>與Stripe連結</Button>
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
                                    </React.Fragment>
                                }
                            </List>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    )
}

export default User