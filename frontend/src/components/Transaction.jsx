import React, { useEffect, useCallback, useState } from 'react';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios'

const useStyles = makeStyles(() => ({
    view: {
        height: '85vh',
        overflowY: 'scroll',
    }
}))

function Transaction() {
    const classes = useStyles()
    const [state, setState] = useState({
        invoices: []
    })

    const fetchData = useCallback(async () => {
        const res = await axios.get('/transaction/invoices', {
            headers: {
                'x-auth-token': window.localStorage.getItem('token')
            }
        })
        setState({
            invoices: res.data.invoices
        })
    }, [])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    return (
        <Container>
            <Grid container justifyContent="center">
                <Paper className={classes.view}>
                    <List>
                        {state.invoices.map((el, i) =>
                            <ListItem>
                                <Card>
                                    <CardContent>
                                        <Grid container spacing={10}>
                                            <Grid item>
                                                <ListItemText
                                                    primary={'id'}
                                                    secondary={el._id}
                                                />
                                                <ListItemText
                                                    primary={'時間'}
                                                    secondary={`${new Date(el.createdAt).getFullYear()}年${new Date(el.createdAt).getMonth() + 1}月${new Date(el.createdAt).getDate()}日 ${new Date(el.createdAt).getHours()}時${new Date(el.createdAt).getMinutes()}分${new Date(el.createdAt).getSeconds()}秒`}
                                                />
                                                <ListItemText
                                                    primary={'服務'}
                                                    secondary={el.service.name}
                                                />
                                                <ListItemText
                                                    primary={'店家'}
                                                    secondary={el.owner.title}
                                                />
                                                <ListItemText
                                                    primary={'總計'}
                                                    secondary={`$${el.amount}`}
                                                />
                                            </Grid>
                                            <Grid item>
                                                <ListItemText
                                                    primary={'預訂時段'}
                                                    secondary={
                                                        <List>
                                                            {el.appointment.map((n, i) =>
                                                                <ListItem key={i}>
                                                                    <ListItemText
                                                                        primary={`${n.year}年${n.month}月${n.date}日 ${n.hour}:00 - ${n.hour + 1}:00`}
                                                                    />
                                                                </ListItem>
                                                            )}
                                                        </List>
                                                    }
                                                />
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            </ListItem>
                        )}
                    </List>
                </Paper>
            </Grid>
        </Container>
    )
}

export default Transaction