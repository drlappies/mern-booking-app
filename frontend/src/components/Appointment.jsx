import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Container from '@material-ui/core/Container';
import Calendar from './Calendar';

function Appointment() {
    const [booking, setBooking] = useState([]);
    const [openingTime, setOpeningTime] = useState(9);
    const [closingTime, setClosingTime] = useState(23);
    const { roomId, serviceId } = useParams();

    useEffect(() => {
        fetchAppointments()
    }, [])

    const fetchAppointments = async () => {
        const bookings = await axios.get(`/room/${roomId}/service/${serviceId}/appointment`);
        const room = await axios.get(`/room/${roomId}`);
        setBooking(bookings.timeslots);
        setOpeningTime(room.data.operatingHour.openingTime);
        setClosingTime(room.data.operatingHour.closingTime);
    }

    return (
        <Container>
            <Calendar
                booking={booking}
                openingTime={openingTime}
                closingTime={closingTime}
            />
        </Container>
    )
}

export default Appointment