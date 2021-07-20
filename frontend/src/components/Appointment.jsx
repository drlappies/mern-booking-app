import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Container from '@material-ui/core/Container';
import Calendar from './Calendar';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

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
    const [openingTime, setOpeningTime] = useState(9);
    const [closingTime, setClosingTime] = useState(23);
    const [roomName, setRoomName] = useState('');
    const [serviceName, setServiceName] = useState('');
    const [serviceRemark, setServiceRemark] = useState('');
    const [servicePrice, setServicePrice] = useState(0);
    const [availableWeekday, setAvailableWeekday] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const { roomId, serviceId } = useParams();

    useEffect(() => {
        fetchData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const fetchData = async () => {
        try {
            const room = await axios.get(`/room/${roomId}`);
            const appointments = await axios.get(`/room/${roomId}/service/${serviceId}/appointment`)
            console.log(appointments)
            setAppointments(appointments.data)
            setOpeningTime(room.data.availability.operatingTime.openingTime);
            setClosingTime(room.data.availability.operatingTime.closingTime);
            setRoomName(room.data.title);
            setServiceName(room.data.services.find(el => el._id === serviceId).name)
            setServiceRemark(room.data.services.find(el => el._id === serviceId).remark)
            setServicePrice(room.data.services.find(el => el._id === serviceId).pricing)
            setAvailableWeekday(room.data.availability.weekday);
        } catch (err) {
            console.log(err)
        }
    }

    const availability = useMemo(() => checkIsDayOpen(availableWeekday), [availableWeekday])

    return (
        <Container>
            <Grid container direction="row" spacing={1}>
                <Grid item xs={12}>
                    <Typography variant="h4">{roomName}</Typography>
                    <Typography display="inline" variant="h5">{serviceName}</Typography>
                    <Typography display="inline"> - </Typography>
                    <Typography display="inline" variant="subtitle1">{serviceRemark}</Typography>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="subtitle1">營業日子：逢星期{availability.map((el, i) => <span key={i}>&nbsp;{weekday[el]}&nbsp;</span>)}</Typography>
                    <Typography variant="subtitle1">營業時間：{openingTime}:00 - {closingTime}:00</Typography>
                    <Typography variant="subtitle1">收費：{servicePrice} / 小時</Typography>
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