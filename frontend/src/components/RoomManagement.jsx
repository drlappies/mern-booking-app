import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Switch, Route, NavLink } from 'react-router-dom'
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Roomnav from './Roomnav'
import Roomview from './Roomview';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios'

const useStyles = makeStyles(() => ({
    view: {
        height: '85vh',
        overflowY: 'scroll',
    }
}))

function RoomManagement() {
    const [state, setState] = useState([])
    const classes = useStyles();

    const fetchData = useCallback(async () => {
        try {
            const res = await axios.get('/room/management', { headers: { 'x-auth-token': window.localStorage.getItem('token') } })
            setState(res.data);
        } catch (err) {
            console.log(err)
        }
    }, [])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    return (
        <Container>
            <Router>
                <Grid container spacing={1}>
                    <Grid item xs={2}>
                        <Paper elevation={3} className={classes.view}>
                            {state.map((el, i) =>
                                <NavLink key={i} to={`/management/${el._id}`} style={{ textDecoration: 'none' }} >
                                    <Roomnav
                                        title={el.title}
                                        createdAt={el.createdAt}
                                        updatedAt={el.updatedAt}
                                    />
                                </NavLink>
                            )}
                        </Paper>
                    </Grid>
                    <Grid item xs={10}>
                        <Paper elevation={3} className={classes.view}>
                            <Switch>
                                {state.map((el, i) =>
                                    <Route exact path={`/management/${el._id}`} key={i}>
                                        <Roomview
                                            id={el._id}
                                        />
                                    </Route>
                                )}
                            </Switch>
                        </Paper>
                    </Grid>
                </Grid>
            </Router>
        </Container>
    )
}

export default RoomManagement