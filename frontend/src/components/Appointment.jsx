import React, { useState, useEffect, useContext, useCallback } from 'react';
import { AppointmentContext } from './contexts/AppointmentContext';
import { useSnackbar } from 'notistack';
import { Link, useParams, useHistory } from 'react-router-dom';
import axios from 'axios';
import Container from '@material-ui/core/Container';
import Calendar from './Calendar';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';

function Appointment(props) {
    const { enqueueSnackbar } = useSnackbar();
    const history = useHistory();
    const { roomId, serviceId } = useParams();
    const { selectedTimeslots, currentRoom } = useContext(AppointmentContext);
    const [state, setState] = useState({
        appointments: [],
    })

    const fetchData = useCallback(async () => {
        try {
            const appointments = await axios.get(`${process.env.REACT_APP_API_ENDPOINT}/api/appointment/${roomId}/room/${serviceId}/service`);
            setState({ appointments: appointments.data })
        } catch (err) {
            enqueueSnackbar(err.response.data.error, { variant: 'error', autoHideDuration: 1500, anchorOrigin: { vertical: 'top', horizontal: 'center' }, preventDuplicate: true })
        }
    }, [enqueueSnackbar, roomId, serviceId])

    useEffect(() => {
        fetchData();
    }, [fetchData])

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
                    <Calendar
                        openingTime={currentRoom.openingTime}
                        closingTime={currentRoom.closingTime}
                        appointments={state.appointments}
                        openWeekday={currentRoom.openWeekday}
                    />
                </Grid>
            </Grid>
        </Container>
    )
}

export default Appointment