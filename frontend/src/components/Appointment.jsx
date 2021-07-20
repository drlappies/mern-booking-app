import React, { useState, useEffect, useMemo, useContext } from 'react';
import { AppointmentContext } from './contexts/AppointmentContext';
import { Link, useParams, useLocation, useHistory } from 'react-router-dom';
import axios from 'axios';
import Container from '@material-ui/core/Container';
import Calendar from './Calendar';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';

const weekday = [
    '日',
    '一',
    '二',
    '三',
    '四',
    '五',
    '六',
]

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
    const { pathname } = useLocation();
    const history = useHistory();
    const { selectedTimeslots } = useContext(AppointmentContext)
    const [openingTime, setOpeningTime] = useState(9);
    const [closingTime, setClosingTime] = useState(23);
    const [availableWeekday, setAvailableWeekday] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const { roomId, serviceId } = useParams();

    useEffect(() => {
        fetchData()
        window.scrollTo(0, 0);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname])

    const fetchData = async () => {
        try {
            const room = await axios.get(`/room/${roomId}`);
            const appointments = await axios.get(`/room/${roomId}/service/${serviceId}/appointment`)
            setAppointments(appointments.data)
            setOpeningTime(room.data.availability.operatingTime.openingTime);
            setClosingTime(room.data.availability.operatingTime.closingTime);
            setAvailableWeekday(room.data.availability.weekday);
        } catch (err) {
            console.log(err)
        }
    }

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
                    <Calendar
                        openingTime={openingTime}
                        closingTime={closingTime}
                        appointments={appointments}
                        availableWeekday={availability}
                    />
                </Grid>
            </Grid>
        </Container>
    )
}

export default Appointment