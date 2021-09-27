import React, { useState } from 'react';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core';
import List from '@material-ui/core/List';
import ListItemText from '@material-ui/core/ListItemText'
import ListItem from '@material-ui/core/ListItem'
import axios from 'axios'

const useStyles = makeStyles(() => ({
    root: {
        width: '400px',
        padding: '15px 0px 15px 0px'
    }
}))

function RecordSearch() {
    const classes = useStyles()
    const [state, setState] = useState({
        invoiceId: '',
        id: '',
        finder: '',
        service: '',
        amount: '',
        appointment: [],
    })

    const handleChange = (e) => {
        setState(prevState => {
            return {
                ...prevState,
                invoiceId: e.target.value
            }
        })
    }

    const handleSubmit = async () => {
        try {
            const payload = {
                invoiceId: state.invoiceId
            }
            const res = await axios.post(`${process.env.REACT_APP_API_ENDPOINT}/transaction/invoice`, payload, {
                headers: {
                    'x-auth-token': window.localStorage.getItem('token')
                }
            })
            if (res.data.id) {
                setState(prevState => {
                    return {
                        ...prevState,
                        id: res.data.id,
                        finder: res.data.finder.username,
                        service: res.data.service.name,
                        room: res.data.service.room.title,
                        amount: res.data.amount,
                        appointment: res.data.appointment
                    }
                })
            } else {
                setState({
                    invoiceId: '',
                    id: '',
                    finder: '',
                    service: '',
                    amount: '',
                    appointment: [],
                })
            }
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <Container>
            <Grid container justifyContent="center">
                <Paper className={classes.root}>
                    <Grid container justifyContent="space-around" alignItems="center">
                        <Grid item>
                            <TextField
                                label="尋找預訂"
                                type="text"
                                value={state.invoiceId}
                                onChange={(e) => handleChange(e)}
                            />
                        </Grid>
                        <Grid item>
                            <Button variant="contained" color="primary" onClick={() => handleSubmit()}>尋找</Button>
                        </Grid>
                        <Grid item xs={12}>
                            <Paper>
                                <List>
                                    <ListItem>
                                        <ListItemText
                                            primary={'訂單號碼'}
                                            secondary={state.id}
                                        />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemText
                                            primary={'用戶'}
                                            secondary={state.finder}
                                        />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemText
                                            primary={'房間'}
                                            secondary={state.room}
                                        />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemText
                                            primary={'服務'}
                                            secondary={state.service}
                                        />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemText
                                            primary={'時段'}
                                            secondary={
                                                <List>
                                                    {state.appointment.map((el, i) =>
                                                        <ListItem>
                                                            <ListItemText
                                                                secondary={`${el.year} 年 ${el.month} 月 ${el.date} 日 ${el.hour}:00 - ${el.hour + 1} :00`}
                                                            />
                                                        </ListItem>
                                                    )}
                                                </List>
                                            }
                                        />
                                    </ListItem>
                                </List>
                            </Paper>
                        </Grid>
                    </Grid>
                </Paper>
            </Grid>
        </Container>
    )
}

export default RecordSearch