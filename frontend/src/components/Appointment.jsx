import React, { useState, useEffect, useMemo, useContext, useCallback } from 'react';
import { AppointmentContext } from './contexts/AppointmentContext';
import { AuthenticationContext } from './contexts/AuthenticationContext';
import { useSnackbar } from 'notistack';
import { Link, useParams, useHistory } from 'react-router-dom';
import axios from 'axios';
import Container from '@material-ui/core/Container';
import Calendar from './Calendar';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';

function checkIsDayOpen(availableWeekday) {
    const availability = [];
    let increment = 0;
    for (let key in availableWeekday) {
        if (availableWeekday[key]) {
            availability.push(increment);
        }
        increment = increment + 1;
    }

    return availability;
}

function Appointment() {
    const { enqueueSnackbar } = useSnackbar();
    const history = useHistory();
    const { roomId, serviceId } = useParams();
    const { selectedTimeslots } = useContext(AppointmentContext);
    const [state, setState] = useState({
        openingTime: 0,
        closingTime: 0,
        appointments: [],
        availableWeekday: [],
    })

    const fetchData = useCallback(async () => {
        try {
            const room = await axios.get(`/room/${roomId}`);
            const appointments = await axios.get(`/room/${roomId}/service/${serviceId}/appointment`);
            setState({
                openingTime: room.data.openingTime,
                closingTime: room.data.closingTime,
                appointments: appointments.data,
                availableWeekday: room.data.openWeekday
            })
        } catch (err) {
            enqueueSnackbar(`${err}`, { variant: 'error', autoHideDuration: 1500, anchorOrigin: { vertical: 'top', horizontal: 'center' }, preventDuplicate: true })
            console.log(err)
        }
    }, [enqueueSnackbar, roomId, serviceId])

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchData();
    }, [fetchData])

    const availability = useMemo(() => checkIsDayOpen(state.availableWeekday), [state.availableWeekday])

    return (
        <Container>
            <Grid container direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
                <Grid item>
                    <Button startIcon={<ArrowBackIosIcon />} onClick={() => history.goBack()}>返回</Button>
                </Grid>
                <Grid item>
                    <Button disabled={selectedTimeslots <= 0} component={Link} to={`/room/${roomId}/service/${serviceId}/appointment/confirmation`} endIcon={<ArrowForwardIosIcon />}>繼續</Button>
                </Grid>
                <Grid item xs={12}>
                    {state.openingTime && state.closingTime && state.appointments && availability ?
                        <Calendar
                            openingTime={state.openingTime}
                            closingTime={state.closingTime}
                            appointments={state.appointments}
                            availableWeekday={availability}
                        />
                        :
                        <div></div>
                    }
                </Grid>
            </Grid>
        </Container>
    )
}

export default Appointment