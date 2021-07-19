import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Container from '@material-ui/core/Container';
import Calendar from './Calendar';

function Appointment() {
    const [openingTime, setOpeningTime] = useState();
    const [closingTime, setClosingTime] = useState();
    const [roomName, setRoomName] = useState();
    const [serviceName, setServiceName] = useState();
    const [serviceRemark, setServiceRemark] = useState();
    const [servicePrice, setServicePrice] = useState();
    const [availableWeekday, setAvailableWeekday] = useState();
    const { roomId, serviceId } = useParams();

    useEffect(() => {
        fetchAppointments()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const fetchAppointments = async () => {
        try {
            const res = await axios.get(`/room/${roomId}`);
            setOpeningTime(res.data.availability.operatingTime.openingTime);
            setClosingTime(res.data.availability.operatingTime.closingTime);
            setRoomName(res.data.title);
            setServiceName(res.data.services.find(el => el._id === serviceId).name)
            setServiceRemark(res.data.services.find(el => el._id === serviceId).remark)
            setServicePrice(res.data.services.find(el => el._id === serviceId).pricing)
            setAvailableWeekday(res.data.availability.weekday);
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <Container>
            <Calendar
                openingTime={openingTime}
                closingTime={closingTime}
                roomName={roomName}
                serviceName={serviceName}
                serviceRemark={serviceRemark}
                servicePrice={servicePrice}
                availableWeekday={availableWeekday}
            />
        </Container>
    )
}

export default Appointment