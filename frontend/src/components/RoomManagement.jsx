import React, { useEffect, useContext, useCallback, useState } from 'react';
import { AuthenticationContext } from './contexts/AuthenticationContext';
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
    const classes = useStyles();
    const { checkPermission } = useContext(AuthenticationContext);
    const [state, setState] = useState([]);
    const [currentView, setCurrentView] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = useCallback(async () => {
        const res = await axios.get('/room/management', { headers: { 'x-auth-token': window.localStorage.getItem('token') } })
        setState(prevState => {
            return prevState = res.data
        });
        setIsLoading(false)
    }, [])

    const handleSwitch = (key) => {
        setCurrentView(prevState => {
            return prevState = key
        })
    }

    useEffect(() => {
        fetchData()
        checkPermission('Owner');
    }, [checkPermission, fetchData])

    return (
        <Container>
            <Grid container spacing={1}>
                <Grid item xs={4}>
                    <Paper elevation={3} className={classes.view}>
                        {state.map((el, i) =>
                            <Roomnav
                                key={i}
                                id={el._id}
                                title={el.title}
                                createdAt={el.createdAt}
                                updatedAt={el.updatedAt}
                                onClick={() => handleSwitch(i)}
                            />
                        )}
                    </Paper>
                </Grid>
                <Grid item xs={8}>
                    <Paper elevation={3} className={classes.view}>
                        {isLoading ? null :
                            <Roomview
                                isVerified={state[currentView].isVerified}
                                id={state[currentView]._id}
                                title={state[currentView].title}
                                description={state[currentView].description}
                                street={state[currentView].address.street}
                                floor={state[currentView].address.floor}
                                flat={state[currentView].address.flat}
                                building={state[currentView].address.building}
                                region={state[currentView].address.region}
                                imgurl={state[currentView].imageUrl}
                                imgkey={state[currentView].imageKey}
                                openingTime={state[currentView].openingTime}
                                closingTime={state[currentView].closingTime}
                                openWeekday={state[currentView].openWeekday}
                                services={state[currentView].services}
                            />
                        }
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    )
}

export default RoomManagement