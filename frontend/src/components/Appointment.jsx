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
    console.log('appointment rerenders')
    const { enqueueSnackbar } = useSnackbar();
    const history = useHistory();
    const { roomId, serviceId } = useParams();
    const { selectedTimeslots } = useContext(AppointmentContext);
    const { checkPermission } = useContext(AuthenticationContext);
    const [openingTime, setOpeningTime] = useState();
    const [closingTime, setClosingTime] = useState();
    const [availableWeekday, setAvailableWeekday] = useState([]);
    const [appointments, setAppointments] = useState([]);

    const fetchData = useCallback(async () => {
        try {
            const room = await axios.get(`/room/${roomId}`);
            const appointments = await axios.get(`/room/${roomId}/service/${serviceId}/appointment`)
            setAppointments(appointments.data)
            setOpeningTime(room.data.openingTime);
            setClosingTime(room.data.closingTime);
            setAvailableWeekday(room.data.openWeekday);
        } catch (err) {
            enqueueSnackbar(`${err}`, { variant: 'error', autoHideDuration: 1500, anchorOrigin: { vertical: 'top', horizontal: 'center' }, preventDuplicate: true })
            console.log(err)
        }
    }, [enqueueSnackbar, roomId, serviceId])

    useEffect(() => {
        window.scrollTo(0, 0);
        checkPermission();
        fetchData();
    }, [checkPermission, fetchData])

    const availability = useMemo(() => checkIsDayOpen(availableWeekday), [availableWeekday])

    return (
        <Container>
            <Grid container direction="row" justify="space-between" alignItems="center" spacing={1}>
                <Grid item>
                    <Button startIcon={<ArrowBackIosIcon />} onClick={() => history.goBack()}>返回</Button>
                </Grid>
                <Grid item>
                    <Button disabled={selectedTimeslots <= 0} component={Link} to={`/room/${roomId}/service/${serviceId}/appointment/confirmation`} endIcon={<ArrowForwardIosIcon />}>繼續</Button>
                </Grid>
                <Grid item xs={12}>
                    {openingTime && closingTime && appointments && availability ?
                        <Calendar
                            openingTime={openingTime}
                            closingTime={closingTime}
                            appointments={appointments}
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